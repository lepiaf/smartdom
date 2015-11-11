var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

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
    payload : {type : SchemaTypes.Double, default: ''},
    createdAt : {type : Date, default: new Date()}
});
