function doesRuleMatch(rule, req, botscore, fingerprint, asn, country) {
    for (const condition of rule.condition) {
        console.log(condition)
        let requestValue;
        switch (condition.field) {
            case 'header':
                requestValue = req.headers[condition.key.toLowerCase()];
                break;
            case 'httpVersion':
                requestValue = req.httpVersion;
                break;
            case 'body':
                requestValue = JSON.stringify(req.body);
                break;
            case 'query':
                requestValue = JSON.stringify(req.query);
                break;
            case 'path':
                requestValue = req.path;
                break;
            case 'botscore':
                requestValue = botscore;
                break;
            case 'asn':
                requestValue = asn;
                break;
            case 'country':
                requestValue = country;
                break;
            case 'fingerprint':
                requestValue = fingerprint;
                break;
            default:
                // If the field type is unknown, this condition fails.
                return false;
        }

        // If the value to be checked doesn't exist on the request, the condition fails.
        if (requestValue === undefined || requestValue === null) {
            return false;
        }

        // 2. Apply the filter to compare the request value with the rule's value.
        let isMatch = false;
        const ruleValue = condition.value;
        console.log(requestValue)
        switch (condition.filter) {
            case 'equals':
                isMatch = String(requestValue) === String(ruleValue);
                break;
            case 'gte': // Greater than or equal to
                isMatch = !isNaN(requestValue) && !isNaN(ruleValue) && parseFloat(requestValue) >= parseFloat(ruleValue);
                break;
            case 'lte': // Less than or equal to
                isMatch = !isNaN(requestValue) && !isNaN(ruleValue) && parseFloat(requestValue) <= parseFloat(ruleValue);
                break;
            case 'regex':
                try {
                    console.log('doing condition')
                    const re = new RegExp(ruleValue);
                    isMatch = re.test(requestValue);
                    console.log(isMatch)
                } catch (e) {
                    console.error(`Invalid regex in rule: ${rule.name}`, e);
                    isMatch = false;
                }
                break;
            default:
                console.log('default')
                isMatch = false;
                break;
        }
        
        // If any condition is not a match, the entire rule fails.
        if (!isMatch) {
            return false;
        }
    }

    // If the loop completes, all conditions were met.
    return true;
}

module.exports = doesRuleMatch;