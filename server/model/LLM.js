const { model, Schema } = require('mongoose');

const LLM = Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    rawResponse : {
        type : String
    },
    systemInstructions : {
        type : Object
    },
    generationConfig : {
        type : Object
    },
    cpuUsage : {
        type : String
    },
    memUsage : {
        type : String
    },
    dataAnalysed : {
        type : Array
    },
    overview : {
        type : String
    },
    reason : {
        type : String
    },
    rules : {
        type : Array
    }
});

module.exports = model('LLM', LLM);