const Token = require('../models/AuthToken');
const User = require('../models/User');

const yup = require('yup');

const schema = yup.object().shape({
	AuthKey: yup.string().required('Authentication is required')
});

const auth = async (req, res, next) => {
    const {
        authentication: AuthKey
    } = req.headers;
    try {
        await schema.validate({
            AuthKey
        });
        const tokenFound = await Token.findOne({
            _id : AuthKey
        });
        if(!tokenFound)
            throw new Error('Invalid Authentication.')
        const userFound = await User.findOne({
            _id: tokenFound.refUser
        });
        if(!userFound)
            throw new Error('Invalid User.');
        req.token = tokenFound;
        req.user = userFound;
        next();
    } catch (e) {
        next(e);
    }
}

module.exports = auth