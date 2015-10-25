var mongoose = require('mongoose');

/**
 * Event document
 */
module.exports = mongoose.model('Event', {
    name : {type : String, default: ''},
    nodeId : {type : String, default: ''},
    childSensorId : {type : String, default: ''},
    messageType : {type : String, default: ''},
    ack : {type : String, default: ''},
    subType : {type : String, default: ''},
    payload : {type : String, default: ''},
    createdAt : {type : Date, default: new Date()}
});
