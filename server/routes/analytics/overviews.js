const LLM = require('../../model/LLM');

module.exports = (app) => {
    app.get('/api/v1/fetch-overviews', async (req, res, next) => {
        try {
            const allOverviews = await LLM.find({}).sort({
                timestamp: -1
            });
            return res.send({
                success : true,
                overviews: allOverviews
            });
        } catch (err) {
            return next(err);
        }
    })
}