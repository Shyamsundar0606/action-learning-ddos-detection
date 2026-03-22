const Ruleset = require('../../model/Ruleset');

module.exports = (app) => {
    app.get('/api/v1/fetch-rulesets', async (req, res, next) => {
        try {
            const allRulesets = await Ruleset.find({});
            return res.send({
                success : true,
                rulesets: allRulesets
            });
        } catch (err) {
            return next(err);
        }
    })
}