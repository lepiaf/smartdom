var Event = require('./models/event');

module.exports = function(app) {
    // server routes ===========================================================
    app.get('/api/events', function(req, res) {
        Event.aggregate([
            {
                "$match": {
                    "subType": "V_TEMP",
                    "createdAt": {
                        "$gte": new Date("2015-10-18T00:00:00.000Z"),
                        "$lte": new Date("2015-10-19T00:00:00.000Z")
                    }
                }
            },
            {
                "$group": {
                    "_id": {
                        "year":{"$year":"$createdAt"},
                        "month":{"$month":"$createdAt"},
                        "day":{"$dayOfMonth":"$createdAt"},
                        "hour":{"$hour":"$createdAt"}
                        //"minute":{"$minute":"$createdAt"}
                    },
                    "avgMinute": {"$avg":"$payload"}
                }
            }
        ], function(err, results) {
            if (err) {
                res.send(err);
            }

            res.json(results);
        });
    });

    // frontend routes =========================================================
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};