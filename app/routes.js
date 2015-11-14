var Event = require('./models/event');
var eventController = require('./controllers/eventController');
var nodeController = require('./controllers/nodeController');

module.exports = function(app) {
    // server routes ===========================================================
    app.get('/api/events/:subType', eventController.getSubType);
    app.get('/api/events/:subType/lastHour/:selectedHour', eventController.getSubTypeLastHour);

    app.post('/api/nodes', nodeController.postNodes);
    app.put('/api/nodes/:nodeId', nodeController.putNodes);
    app.get('/api/nodes', nodeController.getNodes);
    app.get('/api/nodes/:nodeId', nodeController.getNode);
    app.get('/api/nodes/:nodeId/sensors/:id', nodeController.getNodesOneSensor);

    // frontend routes =========================================================
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load our public/index.html file
    });

};