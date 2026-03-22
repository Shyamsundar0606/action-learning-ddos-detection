const Request = require('../model/Request');
const Ruleset = require('../model/Ruleset');
const doesRuleMatch = require('../utils/doesRuleMatch');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const axios = require('axios')

const BAD_ASNS = ['AS12345 (Example Bad ISP)', 'AS98765 (Another Known Bad ASN)'];
const SUSPICIOUS_ROUTES = ['/admin', '/wp-login.php', '/config.php', '/.env'];
const REQUIRED_HEADERS = ['user-agent', 'accept', 'host'];

const getVpnAPI = async (ip) => {
    const { data: req } = await axios.get(`https://vpnapi.io/api/${ip}?key=${process.env.VPNAPI_API_KEY}`)
    return req;
};

const requestLogger = async (req, res, next) => {
    const startTime = Date.now();
    let wafDecision = 'allow'; // Default WAF decision
    let wafDecisionReason = 'No specific rule triggered';
    let wafRuleId = null;
    let wafRulesetId = null; // Assuming a default ruleset ID for demonstration

    // Parse request headers
    const requestHeaders = req.headers;
    const userAgent = requestHeaders['user-agent'] || '';
    const referer = requestHeaders['referer'];

    // Get client IP address
    // Consider using 'x-forwarded-for' if behind a proxy/load balancer
    let clientIp = req.ip || req.connection.remoteAddress;

    if(clientIp == '::1')
        clientIp = '102.130.115.59' // VPN IP FOR TESTING

    const httpVersion = req.httpVersion

    // Geolocation
    const geo = geoip.lookup(clientIp);
    const country = geo ? geo.country : null;
    const city = geo ? geo.city : null;
    const latitude = geo ? geo.ll[0] : null;
    const longitude = geo ? geo.ll[1] : null;

    let vpnApiOutput = await getVpnAPI(clientIp);
    
    const asn = vpnApiOutput?.network?.autonomous_system_number; // geoip-lite provides ASN number, prefix with 'AS'

    // Parse User-Agent
    const uaParser = new UAParser(userAgent);
    const uaResult = uaParser.getResult();

    // Parse query parameters
    const queryParams = req.query;
    const queryString = Object.keys(queryParams).length > 0 ? new URLSearchParams(queryParams).toString() : null;

    // Extract TLS information (if available, requires specific server setup like Nginx/Apache to pass this via headers)
    const tlsVersion = requestHeaders['x-tls-version'] || null;
    const cipherSuite = requestHeaders['x-cipher-suite'] || null;

    let requestBody = null;
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        try {
            requestBody = JSON.stringify(req.body);
        } catch (e) {
            requestBody = req.body ? String(req.body) : null;
        }
    }

    // --- Bot Score Calculation ---
    let botScore = 0;

    // 1. VPN/Proxy Detection (Placeholder)
    if (vpnApiOutput?.security?.vpn) {
        botScore += 30;
        wafDecisionReason += '; Identified as VPN.';
    }

    if (vpnApiOutput?.security?.proxy) {
        botScore += 35;
        wafDecisionReason += '; Identified as Proxy.';
    }

    if (vpnApiOutput?.security?.tor) {
        botScore += 40;
        wafDecisionReason += '; Identified as TOR.';
    }


    // 2. Bad ASN Check
    if (asn && BAD_ASNS.includes(asn)) {
        botScore += 40; // High penalty for bad ASNs
        wafDecisionReason += `; Bad ASN: ${asn}.`;
    }

    // 3. Missing Important Headers
    const missingHeaders = REQUIRED_HEADERS.filter(header => !requestHeaders[header]);
    if (missingHeaders.length > 0) {
        botScore += (missingHeaders.length * 10); // Penalty for each missing header
        wafDecisionReason += `; Missing headers: ${missingHeaders.join(', ')}.`;
    }

    // 4. Suspicious Route Access
    if (SUSPICIOUS_ROUTES.some(route => req.path.startsWith(route))) {
        botScore += 25; // Penalty for accessing suspicious routes
        wafDecisionReason += `; Accessing suspicious route: ${req.path}.`;
    }

    // 5. User-Agent analysis (basic)
    if (uaResult.device.type === 'spider' || uaResult.browser.name === 'PhantomJS' || !uaResult.browser.name) {
        botScore += 20; // Generic bot UAs or missing browser info
        wafDecisionReason += '; Suspicious User-Agent.';
    }

    // Cap botScore at 100
    botScore = Math.min(100, botScore);

    const rules = await Ruleset.find({ status: 'active' }).sort({ priority: 1 });
    let ref_waf = null;
    let took_decision = false;
    for (const rule of rules) {
        console.log(rule.simpleId)
        if (doesRuleMatch(rule, req, botScore, req.fingerprint.hash, asn, country)) {
            console.log(`Request matched rule: "${rule.name}". Action: ${rule.action}.`);
            ref_waf = rule._id;
            wafDecision = `#${rule.simpleId}`;
            wafDecisionReason = rule.name;
            switch (rule.action) {
                case 'block':
                    took_decision = true
                    res.status(403).send({
                        error: 'Forbidden',
                        message: 'Access denied by security policy.'
                    });

                case 'captcha':
                    console.log('captcha')

                case 'js_challenge':
                    console.log('js challenge')
                    
                default:
                    if(!took_decision)
                        next();
            }
        }
    }
    console.log('passed')
    if(!ref_waf) {
        if (botScore >= 80) {
            wafDecision = 'block';
            wafDecisionReason = wafDecisionReason.includes('; ') ? `High bot score (${botScore}).` + wafDecisionReason : `High bot score (${botScore}).`;
            // Trigger 403
            // return res.status(403).send('Forbidden');
        } else if (botScore >= 50) {
            wafDecision = 'challenge';
            wafDecisionReason = wafDecisionReason.includes('; ') ? `Medium bot score (${botScore}).` + wafDecisionReason : `Medium bot score (${botScore}).`;
            // Trigger Captcha
        } else if (botScore > 0) {
            wafDecision = 'log_only';
            wafDecisionReason = wafDecisionReason.includes('; ') ? `Low bot score (${botScore}).` + wafDecisionReason : `Low bot score (${botScore}).`;
        }
    }

    let reqA = {
        httpVersion,
        timestamp: new Date(),
        clientIp: clientIp,
        asn: asn,
        botScore: botScore,
        requestMethod: req.method,
        requestPath: req.path,
        queryString: queryString,
        queryParams: queryParams,
        requestHeaders: requestHeaders,
        requestBody: requestBody,
        userAgent: userAgent,
        referer: referer,
        country: country,
        city: city,
        latitude: latitude,
        longitude: longitude,
        tlsVersion: tlsVersion,
        cipherSuite: cipherSuite,
        wafDecision: wafDecision,
        wafRuleId: wafRuleId,
        wafRulesetId: wafRulesetId,
        wafDecisionReason: wafDecisionReason,
    }
    // Log request after the response is sent (to capture status code and response size)
    res.on('finish', async () => {
        const responseTime = Date.now() - startTime;
        const statusCode = res.statusCode;
        const responseSize = parseInt(res.get('Content-Length') || 0, 10);

        await Request.create({
            httpVersion: httpVersion,
            ipAddress: reqA.clientIp,
            ASN: reqA.asn,
            botScore: reqA.botScore,
            method: reqA.requestMethod,
            route: reqA.requestPath,
            body: reqA.requestBody,
            queryParams: reqA.queryParams,
            countryCode: reqA.country,
            tlsVersion: reqA.tlsVersion,
            cipherSuite: reqA.cipherSuite,
            timestamp: reqA.timestamp,
            requestHeaders: reqA.requestHeaders,
            statusCode: statusCode,
            responseTime: responseTime,
            responseSize: responseSize,
            wafDecision,
            wafDecisionReason,
            ref_waf
        });

        try {
            console.log(`Request logged for ${clientIp} - ${req.method} ${req.path} - Bot Score: ${botScore}`);
        } catch (error) {
            console.error('Error logging request:', error);
        }
    });
    if(!took_decision)
        next();
};

module.exports = { requestLogger };