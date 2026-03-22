const { model, Schema } = require('mongoose');

const WAF = Schema({
    decision: {
        type: String
    },
    reason: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ref_request: {
        type: Schema.Types.ObjectId,
        ref: 'Request'
    },
    ref_ruleset: {
        type: Schema.Types.ObjectId,
        ref: 'Ruleset'
    }
});

module.exports = model('WAF', WAF);