var Event = require('./models/event');
var eventController = require('./controllers/eventController');

module.exports = function(app) {
    // server routes ===========================================================
    app.get('/api/events/:subType', eventController.getSubType);

    // frontend routes =========================================================
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load our public/index.html file
    });

};