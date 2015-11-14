var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    name: {type: String, default: ''},
    nodeId: {type: String, default: ''},
    childSensorId: {type: String, default: ''},
    messageType: {type: String, default: ''},
    ack: {type: String, default: ''},
    subType: {type: String, default: ''},
    payload: {type: SchemaTypes.Double, default: ''},
    createdAt: {type: Date, default: new Date()}
});

EventSchema.pre('save', function (next) {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Event', EventSchema);
