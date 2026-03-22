const Request = require('../../model/Request');

module.exports = (app) => {
	app.get('/api/v1/fetch-requests', async (req, res, next) => {
		try {
            const allRequests = await Request.find({}).sort({
				timestamp: -1
			});
			return res.send({
				success : true,
				requests: allRequests
			});
		} catch (err) {
			return next(err);
		}
	})
}