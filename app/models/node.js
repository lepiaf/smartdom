var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SensorSchema = new Schema({
    name: {type: String, default: ''},
    sensorId: {type: Number, default: ''},
    createdAt: {type: Date}
});

var NodeSchema = new Schema({
    name: {type: String, default: ''},
    nodeId: {type: Number, default: ''},
    createdAt: {type: Date},
    childSensors: [SensorSchema]
});

NodeSchema.pre('save', function (next) {
    var now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

SensorSchema.pre('save', function (next) {
    var now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Node', NodeSchema);
