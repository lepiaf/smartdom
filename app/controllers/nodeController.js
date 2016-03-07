var Node = require('../models/node');
var _ = require('lodash');
var async = require('async');
var MySensors = require('../services/MySensors');

module.exports = {
    influxClient: null,
    eventEmitter: null,
    putNodesSensorsRemote: function (req, res) {
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

                var message = MySensors.createMessage(
                    req.params.node,
                    sensor.sensorId,
                    MySensors.messageType.set,
                    20,
                    req.body.button
                );

                module.exports.eventEmitter.emit('mysensors_send_message', message);

                res.send({message: "State changed", node: req.params.node, sensor: sensor.sensorId, state: req.body.button});
            });
        });
    },
    /**
     * Change state of sensor
     *
     * @param req
     * @param res
     */
    putNodesSensorsState: function (req, res) {
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

                var message = MySensors.createMessage(
                    req.params.node,
                    sensor.sensorId,
                    MySensors.messageType.req,
                    MySensors.valueType.V_STATUS,
                    req.body.state
                );

                module.exports.eventEmitter.emit('mysensors_send_message', message);

                res.send({message: "State changed", node: req.params.node, sensor: sensor.sensorId, state: req.body.state});
            });
        });
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
    },
    /**
     * Get temperature from influx db
     * @param req
     * @param res
     */
    getNodesSensorsTemperature: function(req, res) {
        var self = this;
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
                
                var query = 'SELECT last("payload") FROM "V_TEMP" WHERE "childSensorId" = \''+sensor.sensorId+'\' AND time > now() - 1h';
                module.exports.influxClient.query(query, function(err, results) {
                    res.send(results[0][0]);
                });
            });
        });
    },
    /**
     * Get state from influx db
     * @param req
     * @param res
     */
    getNodesSensorsState: function(req, res) {
        var self = this;
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

                var query = 'SELECT last("payload"), nodeId, childSensorId FROM "V_STATUS" WHERE "childSensorId" = \''+sensor.sensorId+'\' and "nodeId" = \''+req.params.node+'\'';
                module.exports.influxClient.query(query, function(err, results) {
                    res.send(results[0][0]);
                });
            });
        });
    }
};
