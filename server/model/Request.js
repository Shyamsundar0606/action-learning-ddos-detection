const { model, Schema } = require('mongoose');

const Request = Schema({
    httpVersion : {
        type : String
    },
    ipAddress: {
        type: String,
        required: true
    },
    ASN: {
        type: String
    },
    botScore: {
        type: Number
    },
    method: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    },
    body: {
        type: Schema.Types.Mixed
    },
    queryParams: {
        type: Object
    },
    requestHeaders : {
        type : Object
    },
    statusCode: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    responseTime : {
        type: Schema.Types.Mixed
    },
    responseSize : {
        type : Number
    },
    tlsVersion: {
        type: String
    },
    cipherSuite: {
        type: String
    },
    countryCode: {
        type: String
    },
    wafDecision : {
        type : String
    },
    wafDecisionReason : {
        type : String
    },
    ref_waf: {
        type: Schema.Types.ObjectId,
        ref: 'WAF'
    }
});

module.exports = model('Request', Request);