const cron = require('node-cron');
const Request = require('../model/Request');
const axios = require('axios');
const LLM = require('../model/LLM');
const { showMemoryUsage, usagePercent } = require("node-system-stats");

const systemInstruction = {
    parts: [{
        text: `
You are an advanced, automated WAF (Web Application Firewall) analysis and response system. Your only function is to analyze server metrics and HTTP request logs to detect and mitigate potential threats like DDoS attacks, scraping, or vulnerability scanning. You must be decisive and act based only on the data provided.

You will receive input in a single, structured JSON format:
{
  "cpu_usage": <float>,      // as a percentage, e.g., 95.5
  "memory_usage": "<rss> <heapTotal> <heapUsed> <external> <arrayBuffers>",
  "http_requests": [         // array of log strings from the last 60 seconds
    "<IP> <TIMESTAMP> \"<METHOD> <URL> <PROTOCOL>\" <STATUS_CODE> \"<USER_AGENT>\"",
    ...
  ]
}

YOUR TASK:
1.  Analyze the 'cpu_usage', 'memory_usage', and the pattern of 'http_requests'.
2.  Look for anomalies:
    -   Sustained high resource usage (CPU or Memory > 90%).
    -   Unusually high volume of requests from a single IP or subnet.
    -   Repetitive requests for the same resource from multiple IPs.
    -   Requests with suspicious User-Agents, query parameters, or body content (e.g., patterns suggesting SQLi, XSS, etc.).
3.  You MUST respond with a single, clean JSON object. DO NOT add any explanations, apologies, or text outside of the JSON structure.

OUTPUT FORMATS:

A) If traffic is normal and resources are stable, use this exact format:
{
  "action": "monitor",
  "severity": "none",
  "reason": "System metrics and traffic patterns are within normal operational parameters.",
  "overview": <Provide your overview here>,
  "rules": []
}

B) If a threat is detected, you MUST escalate. Choose a severity and create specific, actionable rules.
{
  "action": "block",
  "severity": "Low" | "Medium" | "High",
  "reason": "<Brief, specific reason for the action. e.g., 'High volume of requests from IP 192.168.1.123 targeting /login.php'>",
  "overview": <Provide your overview here>,
  "rules": [
    {
      "description": "Block IP due to high request volume",
      "target": "ip",
      "operator": "equals",
      "value": "192.168.1.123"
    },
    {
      "description": "Block common SQL injection pattern in any query parameter",
      "target": "query",
      "operator": "matches_regex",
      "value": "(union|select|insert|--|;)"
    },
    {
      "description": "Block a known malicious user agent",
      "target": "header",
      "header_name": "User-Agent",
      "operator": "equals",
      "value": "BadBot/1.0"
    }
  ]
}

Now, analyze the input you receive and provide ONLY a JSON response.`
    }]
};

const generationConfig = {
    temperature: 0
};

const main = () => {
    cron.schedule('* * * * *', async () => {
        try {
            console.log('scheduler ran')
            const oneMinuteAgo = new Date(Date.now() - 60000);
            const latestRequests = await Request.find({
                timestamp: {
                    $gte: oneMinuteAgo
                }
            }).sort({ timestamp: -1 })
            const cpuUsage = await usagePercent();
            let memUsage = showMemoryUsage();
            memUsage = `${memUsage.rss} ${memUsage.heapTotal} ${memUsage.heapUsed} ${memUsage.external} ${memUsage.arrayBuffers}`;
            console.log(`${cpuUsage.percent}%`, memUsage)
            const payload = {
                generationConfig,
                systemInstruction,
                contents: [
                    {
                        parts: [
                            { 
                                text: JSON.stringify({
                                    cpu_usage: `${cpuUsage.percent}%`,
                                    ram_usage: memUsage,
                                    http_requests: latestRequests
                                }) 
                            },
                        ],
                    },
                ],
            };
            const { data: response } = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
                ...payload
            }, {
                contentType: 'application/json',
                headers: {
                    'x-goog-api-key': process.env.GEMINI_API_KEY,
                }
            })
            //console.log(response.candidates[0].content.parts[0].text)
            const cleanedString = response.candidates[0].content.parts[0].text.replace(/^```json\n|```$/g, '').trim();

            // 2. Parse the cleaned string.
            const parsedData = JSON.parse(cleanedString);
            console.log(parsedData)
            await LLM.create({
                timestamp: new Date(),
                rawResponse: JSON.stringify(response),
                systemInstructions: systemInstruction,
                generationConfig,
                cpuUsage: `${cpuUsage.percent}%`,
                memUsage,
                dataAnalysed: latestRequests,
                overview: parsedData.overview,
                reason: parsedData.reason,
                rules: parsedData.rules
            })
        } catch (error) {
            console.error(error)
        }
    });
}

module.exports = main;
