var Event = require('../models/event');
var moment = require('moment');

module.exports = {
    getSubType: function(req, res) {
        if (req.params.subType !== "V_TEMP" && req.params.subType !== "V_HUM") {
            res.json({"error": "invalid type"});
        }

        Event.aggregate([
            {
                "$match": {
                    "subType": req.params.subType,
                    "createdAt": {
                        "$gte": moment().subtract(1, "day").toDate(),
                        "$lte": moment().toDate()
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
                    },
                    "avgHour": {"$avg":"$payload"}
                }
            },
            {
                "$sort": {
                    "_id": 1
                }
            }
        ], function(err, results) {
            if (err) {
                res.send(err);
            }

            res.json(results);
        });
    },
    getSubTypeLastHour: function(req, res) {
        if (req.params.subType !== "V_TEMP" && req.params.subType !== "V_HUM") {
            res.json({"error": "invalid type"});
        }

        if (!req.params.selectedHour) {
            res.json({"error": "Hour must be selected"});
        }

        Event.aggregate([
            {
                "$match": {
                    "subType": req.params.subType,
                    "createdAt": {
                        "$gte": moment(req.params.selectedHour).subtract(1, "hour").toDate(),
                        "$lte": moment(req.params.selectedHour).toDate()
                    }
                }
            },
            {
                "$group": {
                    "_id": {
                        "year":{"$year":"$createdAt"},
                        "month":{"$month":"$createdAt"},
                        "day":{"$dayOfMonth":"$createdAt"},
                        "hour":{"$hour":"$createdAt"},
                        "minute":{"$minute":"$createdAt"}
                    },
                    "avgMinute": {"$avg":"$payload"}
                }
            },
            {
                "$sort": {
                    "_id": 1
                }
            }
        ], function(err, results) {
            if (err) {
                res.send(err);
            }

            res.json(results);
        });
    }
};
