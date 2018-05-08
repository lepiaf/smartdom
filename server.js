let SerialPort = require('serialport');
let Influx = require('influx');
let events = require('events');
let MySensors = require('./app/services/MySensors');
let weather = require('openweathermap');
let config = require('./config/config');
let schedule = require('node-schedule');
let mqtt = require('mqtt');
let eventEmitter = new events.EventEmitter();
let influxClient = new Influx.InfluxDB({
    host : config.influxdb.smartdom.host,
    username : config.influxdb.smartdom.username,
    password : config.influxdb.smartdom.password,
    database : config.influxdb.smartdom.database
});

console.log('Smartdom is ready');

let mqttClient = mqtt.connect(config.mqtt);
// handle message from mysensors gateway ===================
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();
let sp = new SerialPort(config.arduino, {
    baudRate: 115200,
    autoOpen: true
});
sp.pipe(parser);

sp.on('error', function(data){
    // do nothing
    console.log(data);
});

sp.on('open', function(){
    parser.on('data', function(data) {
        let sensorData = MySensors.parse(data);
        sensorData.payload = isNaN(sensorData.payload) ? sensorData.payload : parseFloat(sensorData.payload);

        if (sensorData.messageType === "internal" || sensorData.childSensorId >= 255) {
            return;
        }

        let influxPoint = {
            nodeId: sensorData.nodeId,
            payload: sensorData.payload,
            subType: sensorData.subType,
            childSensorId: sensorData.childSensorId
        };
	    
        if (sensorData.subType === "V_KWH" || sensorData.subType === "V_WATT") {
	    influxPoint.payloadFloat = parseFloat(influxPoint.payload);
            delete influxPoint.payload;
        }

        console.info("influx point: "+JSON.stringify(influxPoint));

        influxClient.writePoints([{
            measurement: sensorData.subType,
            fields: influxPoint
        }]).catch(err => {
            console.error(`Error saving data to InfluxDB! ${err.stack}`)
        });

        if (mqttClient.connected) {
            mqttClient.publish('mysensors/'+influxPoint.nodeId+'/'+influxPoint.childSensorId, JSON.stringify(influxPoint));
        } else {
            console.error('Not connected to MQTT broker');
        }
    });

    eventEmitter.on('mysensors_send_message', function (message){
        if (mqttClient.connected) {
            let mysensorsMsg = MySensors.parse(message);
            mysensorsMsg.payload = mysensorsMsg.payload.split("\n")[0];
            mqttClient.publish('mysensors/' + mysensorsMsg.nodeId + '/' + mysensorsMsg.childSensorId, JSON.stringify(mysensorsMsg));
        }

        console.info("mysensor message: "+ message);
        sp.write(message, function(err, res) {});
    });

    mqttClient.on('connect', function () {
        mqttClient.subscribe('mysensors/led');
        mqttClient.subscribe('mysensors/switch');
        mqttClient.subscribe('refresh');
    });
});

mqttClient.on('message', function (topic, message) {
    console.log("[MQTT message] "+topic+" "+message.toString());

    if (topic === "mysensors/led") {
        eventEmitter.emit("mysensors_send_message", "8;6;1;0;20;"+message.toString()+"\n");
    }

    if (topic === "mysensors/switch") {
        eventEmitter.emit("mysensors_send_message", "2;1;1;0;2;"+message.toString()+"\n");
    }

    if (topic === "refresh") {
        eventEmitter.emit("smartdom_send_current_state_sensors");
    }
});

eventEmitter.on('smartdom_send_current_state_sensors', () => {
    influxClient.query('select last(payloadFloat), time from V_WATT')
        .then(result => {
            mqttClient.publish('mysensors/1/4', JSON.stringify({payloadFloat:result[0].last}));
        });
    influxClient.query("select last(payload), time from V_TEMP WHERE childSensorId = '5' and nodeId = '4'")
        .then(result => {
            mqttClient.publish('mysensors/4/5', JSON.stringify({payload:result[0].last}));
        });
    influxClient.query("select last(payload), time from V_HUM WHERE childSensorId = '4' and nodeId = '4'")
        .then(result => {
            mqttClient.publish('mysensors/4/4', JSON.stringify({payload:result[0].last}));
        });
    influxClient.query("select last(payload), time from V_HUM WHERE childSensorId = '2' and nodeId = '8'")
        .then(result => {
            mqttClient.publish('mysensors/8/2', JSON.stringify({payload:result[0].last}));
        });
    influxClient.query("select last(payload), time from V_TEMP WHERE childSensorId = '3' and nodeId = '8'")
        .then(result => {
            mqttClient.publish('mysensors/8/3', JSON.stringify({payload:result[0].last}));
        });
    influxClientWeather.query('select last(description), temp from weather')
        .then(result => {
            mqttClient.publish('weather', JSON.stringify({description:result[0].last, temp:result[0].temp}));
        });
});

// handle message from weather api =========================
let influxClientWeather = new Influx.InfluxDB({
    host : config.influxdb.weather.host,
    username : config.influxdb.weather.username,
    password : config.influxdb.weather.password,
    database : config.influxdb.weather.database
});

weather.defaults({units:'metric', lang:'fr', mode:'json', APPID: config.openweathermap.key});

setInterval(function(){
    try {
        weather.now({id: config.openweathermap.city}, function (err, data) {
            const influxPoint = {
                main: data.weather[0].main,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                temp: data.main.temp,
                pressure: data.main.pressure,
                humidity: data.main.humidity,
                wind: data.wind.speed,
                cloud: data.clouds.all
            };

            console.info("weather point: "+JSON.stringify(influxPoint));

            influxClientWeather.writePoints([{
                measurement: 'weather',
                fields: influxPoint
            }]).catch(err => {
                console.error(`Error saving data to InfluxDB! ${err.stack}`)
            });

            if (mqttClient.connected) {
                mqttClient.publish('weather', JSON.stringify(influxPoint));
            } else {
                console.error('Not connected to MQTT broker');
            }
        });
    } catch (e) {
        console.log(e);
    }
}, config.openweathermap.interval);

// shut down led
schedule.scheduleJob('0 9 * * *', function(){
	eventEmitter.emit('mysensors_send_message', "8;6;1;0;20;2\n")
});
