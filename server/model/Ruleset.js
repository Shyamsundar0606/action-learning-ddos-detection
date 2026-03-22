const { model, Schema } = require('mongoose');

const Ruleset = Schema({
    simpleId: {
        type : String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        default: 1
    },
    condition: {
        type: Array
    },
    action: {
        type: String
    },
    timestamp: {
        type: Date
    },
    status: {
        type: String,
        default: 'active'
    },
    ref_user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('Ruleset', Ruleset);