// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var serialport     = require("serialport");
var SerialPort     = serialport.SerialPort;
var influx         = require('influx');
var events         = require('events');
var MySensors      = require('./app/services/MySensors');
var weather        = require('openweathermap');
var schedule       = require('node-schedule');
var heaterController = require('./app/controllers/heaterController');
var config = require('./config/config');

var eventEmitter = new events.EventEmitter();
var influxClient = influx({
    host : config.influxdb.smartdom.host,
    username : config.influxdb.smartdom.username,
    password : config.influxdb.smartdom.password,
    database : config.influxdb.smartdom.database
});

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app, eventEmitter, influxClient); // pass our application into our routes

// start app ===============================================
app.listen(config.port);
console.log('Smartdom is ready on port: ' + config.port);
exports = module.exports = app;
/**
// handle message from mysensors gateway ===================
var sp = new SerialPort(config.arduino, {
    parser: serialport.parsers.readline("\n"),
    baudrate: 115200
}, true);

sp.on('open', function(){
    sp.on('data', function(data) {
        var sensorData = MySensors.parse(data);
        sensorData.payload = parseFloat(sensorData.payload);

        var influxPoint = {
            nodeId: sensorData.nodeId,
            payload: sensorData.payload,
            subType: sensorData.subType,
            childSensorId: sensorData.childSensorId,
            time : new Date()
        };
        console.info("influx point: "+JSON.stringify(influxPoint));

        influxClient.writePoint(sensorData.subType, influxPoint, null, function(err, response) {});
    });

    eventEmitter.on('mysensors_send_message', function (message){
        console.info("mysensor message: "+ message);
        sp.write(message, function(err, res) {});
    });

    eventEmitter.on('mysensors_send_message_heater', function (message1, message2){
        console.info("mysensor message heater: "+ message1);
        console.info("mysensor message heater: "+ message2);

        sp.write(message1, function(err, res) {
            setTimeout(function(){
                sp.write(message2, function(err, res) {});
            }, 200);
        });
    });
});

// handle message from weather api =========================
var influxClientWeather = influx({
    host : config.influxdb.weather.host,
    username : config.influxdb.weather.username,
    password : config.influxdb.weather.password,
    database : config.influxdb.weather.database
});

weather.defaults({units:'metric', lang:'fr', mode:'json', APPID: config.openweathermap.key});

setInterval(function(){
    weather.now({id: config.openweathermap.city}, function (err, data) {
        var influxPoint = {
            main: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            temp: data.main.temp,
            pressure: data.main.pressure,
            humidity: data.main.humidity,
            wind: data.wind.speed,
            cloud: data.clouds.all,
            time : new Date()
        };

        console.info("weather point: "+JSON.stringify(influxPoint));

        influxClientWeather.writePoint("weather", influxPoint, null, function(err, response) {});
    });
}, config.openweathermap.interval);
*/