const { model, Schema } = require('mongoose');

const AuthToken = Schema({
    refUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date
    }
});

module.exports = model('AuthToken', AuthToken);