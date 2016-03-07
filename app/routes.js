var nodeController = require('./controllers/nodeController');
var kodiController = require('./controllers/kodiController');

module.exports = function(app, eventEmitter, influxClient) {
    // share eventEmitter
    nodeController.eventEmitter = eventEmitter;
    nodeController.influxClient = influxClient;

    app.post('/api/kodi', kodiController.post);

    app.put('/api/nodes/:node/sensors/:sensor', nodeController.putNodesSensorsState);
    app.put('/api/nodes/:node/remotes/:sensor', nodeController.putNodesSensorsRemote);

    app.post('/api/nodes', nodeController.postNodes);
    app.put('/api/nodes/:nodeId', nodeController.putNodes);

    app.get('/api/nodes', nodeController.cgetNodes);
    app.get('/api/nodes/:nodeId', nodeController.getNodes);
    app.get('/api/nodes/:nodeId/sensors', nodeController.cgetNodesSensors);
    app.get('/api/nodes/:node/sensors/:sensor', nodeController.getNodesSensors);

    app.get('/api/nodes/:node/sensors/:sensor/temperature', nodeController.getNodesSensorsTemperature);
    app.get('/api/nodes/:node/sensors/:sensor/state', nodeController.getNodesSensorsState);

    // frontend routes =========================================================
    app.all('/*', function(req, res) {
        res.sendfile('public/index.html', { root: __dirname+'/../' });
    });
};
