var nodeController = require('./controllers/nodeController');
var kodiController = require('./controllers/kodiController');
var heaterController = require('./controllers/heaterController');
var userController = require('./controllers/userController');

var passport = require('passport');

module.exports = function(app, eventEmitter, influxClient) {
    // share eventEmitter
    nodeController.eventEmitter = eventEmitter;
    nodeController.influxClient = influxClient;

    heaterController.influxClient = influxClient;
    heaterController.eventEmitter = eventEmitter;

    app.post('/api/message', passport.authenticate('jwt', {session:false}), nodeController.postMessage);
    app.get('/api/power', passport.authenticate('jwt', {session:false}), nodeController.getNodesSensorsPower);
    app.get('/api/power/period', passport.authenticate('jwt', {session:false}), nodeController.getNodesSensorsPeriodPower);

    app.put('/api/heaters/:room', passport.authenticate('jwt', {session:false}), heaterController.putHeaterMode);
    app.get('/api/heaters/:room', passport.authenticate('jwt', {session:false}), heaterController.getHeaterMode);

    app.put('/api/nodes/:node/sensors/:sensor', passport.authenticate('jwt', {session:false}), nodeController.putNodesSensorsState);
    app.put('/api/nodes/:node/remotes/:sensor', passport.authenticate('jwt', {session:false}), nodeController.putNodesSensorsRemote);

    app.get('/api/nodes', passport.authenticate('jwt', {session:false}), nodeController.cgetNodes);
    app.get('/api/nodes/:node', passport.authenticate('jwt', {session:false}), nodeController.getNodes);
    app.get('/api/nodes/:node/sensors', passport.authenticate('jwt', {session:false}), nodeController.cgetNodesSensors);
    app.get('/api/nodes/:node/sensors/:sensor', passport.authenticate('jwt', {session:false}), nodeController.getNodesSensors);

    app.get('/api/nodes/:node/sensors/:sensor/temperature', passport.authenticate('jwt', {session:false}), nodeController.getNodesSensorsTemperature);
    app.get('/api/nodes/:node/sensors/:sensor/humidity', passport.authenticate('jwt', {session:false}), nodeController.getNodesSensorsHumidity);
    app.get('/api/nodes/:node/sensors/:sensor/state', passport.authenticate('jwt', {session:false}), nodeController.getNodesSensorsState);

    app.post('/api/signup', userController.signup);
    app.post('/api/authenticate', userController.authenticate);

    // frontend routes =========================================================
    app.all('/*', function(req, res) {
        res.sendfile('public/index.html', { root: __dirname+'/../' });
    });
};
