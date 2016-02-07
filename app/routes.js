var nodeController = require('./controllers/nodeController');

module.exports = function(app, eventEmitter) {
    // share eventEmitter
    nodeController.eventEmitter = eventEmitter;

    app.put('/api/nodes/:node/sensors/:sensor', nodeController.putNodesSensorsState);
    app.post('/api/nodes', nodeController.postNodes);
    app.put('/api/nodes/:nodeId', nodeController.putNodes);

    app.get('/api/nodes', nodeController.cgetNodes);
    app.get('/api/nodes/:nodeId', nodeController.getNodes);
    app.get('/api/nodes/:nodeId/sensors', nodeController.cgetNodesSensors);
    app.get('/api/nodes/:node/sensors/:sensor', nodeController.getNodesSensors);

    // frontend routes =========================================================
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load our public/index.html file
    });
};
