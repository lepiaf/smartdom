var Node = require('../models/node');
var moment = require('moment');
var _ = require('lodash');
var async = require('async');

module.exports = {
    eventEmitter: null,
    getClose: function (req, res) {
        module.exports.eventEmitter.emit('mysensors_send_message', "2;1;1;0;2;0\n");
        res.send({});
    },
    getOpen: function (req, res) {
        module.exports.eventEmitter.emit('mysensors_send_message', "2;1;1;0;2;1\n");
        res.send({});
    },
    /**
     * Get all sensors of one node
     *
     * @param req
     * @param res
     */
    cgetNodesSensors: function(req, res) {
        Node.findOne({nodeId: req.params.nodeId}, function(err, result) {
            if (err) {
                res.send(err);
            }

            res.send(result.childSensors);
        });
    },
    /**
     * Get one sensors of one node
     *
     * @param req
     * @param res
     */
    getNodesSensors: function(req, res) {
        Node.findOne({nodeId: req.params.node}, function(err, result) {
            if (err) {
                res.send(err);
            }

            async.each(result.childSensors, function (sensor, callback) {
                if (sensor.sensorId == req.params.sensor) {
                    return callback(sensor);
                }

                callback();
            }, function (sensor) {
                if (!sensor) {
                    return res.status(404).send({code: 404, message: "Sensor not found"});
                }

                res.send(sensor);
            });
        });
    },
    /**
     * Get all nodes
     *
     * @param req
     * @param res
     */
    cgetNodes: function(req, res) {
        Node.find(function(err, result) {
            if (err) {
                res.send(err);
            }

            res.send(result);
        });
    },
    /**
     * Get one node
     *
     * @param req
     * @param res
     */
    getNodes: function(req, res) {
        Node.findOne({nodeId: req.params.nodeId},function(err, result) {
            if (err) {
                res.send(err);
            }

            res.send(result);
        });
    },
    /**
     * Create node
     *
     * @param req
     * @param res
     */
    postNodes: function(req, res) {
        var node = new Node(req.body);
        node.save(function(err, data) {
            if (err) {
                res.send(err);
            }

            res.send({id: data.id});
        });
    },
    /**
     * Update node
     *
     * @param req
     * @param res
     */
    putNodes: function(req, res) {
        Node.findOne({nodeId: req.params.nodeId}, function(err, result) {
            if (err) {
                res.send(err);
            }

            _.merge(result, req.body);

            result.save(function(err, data) {
                res.send(data);
            });
        });
    }
};
