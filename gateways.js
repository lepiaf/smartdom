var Sails = require('sails');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
Sails.load(function(err, sails) {
    var sp = new SerialPort("/dev/ttyACM0", {
        parser: serialport.parsers.readline("\n"),
        baudrate: 115200
    });


    sp.on('open', function(){
        sp.on('data', function(data) {
            var sensorData = MySensorsService.parse(data);
            Event.create(sensorData).exec(function(err, data){});
        });
    });
});