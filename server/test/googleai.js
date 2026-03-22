const axios = require('axios');

const API_KEY = "";

const main = async () => {
    try {
        const generationConfig = {
            temperature: 0
        };
        const systemInstruction = {
            parts: [{
            text: `
You are an advanced, automated WAF (Web Application Firewall) analysis and response system. Your only function is to analyze server metrics and HTTP request logs to detect and mitigate potential threats like DDoS attacks, scraping, or vulnerability scanning. You must be decisive and act based only on the data provided.

You will receive input in a single, structured JSON format:
{
  "cpu_usage": <float>,      // as a percentage, e.g., 95.5
  "memory_usage": <float>,   // as a percentage, e.g., 89.1
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
  "rules": []
}

B) If a threat is detected, you MUST escalate. Choose a severity and create specific, actionable rules.
{
  "action": "block",
  "severity": "Low" | "Medium" | "High",
  "reason": "<Brief, specific reason for the action. e.g., 'High volume of requests from IP 192.168.1.123 targeting /login.php'>",
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

Now, analyze the input you receive and provide your JSON response.
`
            }]
        };

        const payload = {
            generationConfig,
            systemInstruction,
            contents: [
            {
                parts: [
                { text: JSON.stringify({
                    cpu_usage: '50%',
                    ram_usage: '50%',
                    http_requests: [
    "89.216.55.12 [21/Jul/2025:11:23:15 +0200] \"GET /index.html HTTP/1.1\" 200 \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36\"",
    "212.200.180.45 [21/Jul/2025:11:23:11 +0200] \"POST /api/v1/login HTTP/1.1\" 200 \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36\"",
    "93.184.216.34 [21/Jul/2025:11:23:08 +0200] \"GET /assets/style.css HTTP/1.1\" 200 \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36\"",
    "66.249.66.1 [21/Jul/2025:11:23:05 +0200] \"GET /robots.txt HTTP/1.1\" 200 \"Googlebot/2.1 (+http://www.google.com/bot.html)\"",
    "89.216.55.12 [21/Jul/2025:11:22:59 +0200] \"GET /products/category/electronics HTTP/1.1\" 200 \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36\"",
    "198.51.100.42 [21/Jul/2025:11:22:56 +0200] \"GET /nonexistent-page.html HTTP/1.1\" 404 \"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/128.0\"",
    "212.200.180.45 [21/Jul/2025:11:22:52 +0200] \"GET /api/v1/user/profile HTTP/1.1\" 403 \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36\"",
    "203.0.113.195 [21/Jul/2025:11:22:48 +0200] \"PUT /api/v1/items/12345 HTTP/1.1\" 500 \"curl/8.4.0\"",
    "66.249.66.1 [21/Jul/2025:11:22:45 +0200] \"GET /products/152 HTTP/1.1\" 200 \"Googlebot/2.1 (+http://www.google.com/bot.html)\"",
    "89.216.55.12 [21/Jul/2025:11:22:40 +0200] \"DELETE /api/v1/session HTTP/1.1\" 204 \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36\""
  ]
                }) },
                ],
            },
            ],
        };
        const { data: response } = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
            ...payload
        }, {
            contentType: 'application/json',
            headers: {
            'x-goog-api-key': API_KEY,
            }
        })
        console.log(response.candidates[0].content.parts[0].text)
    } catch (err) {
        console.log(err)
    }
}
main();