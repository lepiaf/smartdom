// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var serialport     = require("serialport");
var SerialPort     = serialport.SerialPort;
var influx         = require('influx');
var events         = require('events');
var MySensors      = require('./app/services/MySensors');
var schedule       = require('node-schedule');
var weather        = require('openweathermap');

var eventEmitter = new events.EventEmitter();

// config files
var db = require('./config/db');

var port = 9090; // set our port
require('mongoose-double')(mongoose);
mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app, eventEmitter); // pass our application into our routes

// start app ===============================================
app.listen(port);
console.log('Smartdom is ready on port:' + port);
exports = module.exports = app;

var influxClient = influx({
    // or single-host configuration
    host : 'localhost',
    username : 'smartdom',
    password : 'smartdom',
    database : 'smartdom'
});

var sp = new SerialPort("/dev/ttyACM0", {
    parser: serialport.parsers.readline("\n"),
    baudrate: 115200
}, true);

sp.on('open', function(){
    sp.on('data', function(data) {
        var sensorData = MySensors.parse(data);
        if (sensorData.messageType === "internal") {
            return;
        }
        sensorData.payload = parseFloat(sensorData.payload);

        var influxPoint = {
            nodeId: sensorData.nodeId,
            payload: sensorData.payload,
            subType: sensorData.subType,
            childSensorId: sensorData.childSensorId,
            time : new Date()
        };

        influxClient.writePoint(sensorData.subType, influxPoint, null, function(err, response) {});
    });

    eventEmitter.on('mysensors_send_message', function (message){
        sp.write(message, function(err, res) {});
    });
});

var influxClientWeather = influx({
    // or single-host configuration
    host : 'localhost',
    username : 'weather',
    password : 'weather',
    database : 'weather'
});

weather.defaults({units:'metric', lang:'fr', mode:'json', APPID: db.openweathermap.key});

setInterval(function(){
    weather.now({id: db.openweathermap.city}, function (err, data) {
        var influxPoint = {
            main: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            temp: data.main.temp,
            pressure: data.main.pressure,
            humidity: data.main.humidity,
            wind: data.wind.speed,
            cloud: data.clouds.all,
            rain: data.rain['3h'],
            snow: data.snow['3h'],
            time : new Date(data.dt*1000)
        };

        influxClientWeather.writePoint("weather", influxPoint, null, function(err, response) {});
    });
}, 60000);
