const Ruleset = require('../../model/Ruleset');

module.exports = (app) => {
    app.post('/api/v1/add-rulesets', async (req, res, next) => {
        const {
            newRule
        } = req.body;
        try {
            await Ruleset.create({
                simpleId: newRule.simpleId,
                name: newRule.name,
                priority: newRule.priority,
                condition: newRule.condition,
                action: newRule.action,
                timestamp: new Date()
            });
            return res.send({
                success : true
            });
        } catch (err) {
            return next(err);
        }
    })
}