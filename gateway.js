var db = require('./config/db');
var mongoose = require('mongoose');
var MySensors = require('./app/services/MySensors');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var Event = require('./app/models/event');

require('mongoose-double')(mongoose);
mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

var influx = require('influx');

var client = influx({
    // or single-host configuration
    host : 'localhost',
    username : 'smartdom',
    password : 'smartdom',
    database : 'smartdom'
});

console.log("Start gateway");

var sp = new SerialPort("/dev/ttyACM0", {
    parser: serialport.parsers.readline("\n"),
    baudrate: 115200
});


sp.on('open', function(){
    sp.on('data', function(data) {
        var sensorData = MySensors.parse(data);
        if (sensorData.messageType === "internal") {
            return;
        }
        sensorData.payload = parseFloat(sensorData.payload);
        var event = new Event(sensorData);

        var influxPoint = {
            nodeId: sensorData.nodeId,
            payload: sensorData.payload,
            subType: sensorData.subType,
            time : new Date()
        };
        client.writePoint(event.subType, influxPoint, null, function(err, response) {});

        event.save(function(err, data){});
    });
});

