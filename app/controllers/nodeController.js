var _ = require('lodash');
var async = require('async');
var MySensors = require('../services/MySensors');
var nodesDb = require('../../config/nodes.js');
var request = require('request');

module.exports = {
    influxClient: null,
    eventEmitter: null,
    postMessage: function (req, res) {
      request.post({
          url: 'http://pi.home.lan/message',
          json: req.body
      }, function (err, resp, body) {
          res.send(resp);
      });
    },
    putNodesSensorsRemote: function (req, res) {
        nodesDb.repository.findSensor(req.params.node, req.params.sensor, function(err, sensor) {
            if (err) {
                return res.status(404).send({code: 404, message: "Sensor not found"});
            }

            var message = MySensors.createMessage(
                req.params.node,
                sensor.id,
                MySensors.message.set,
                MySensors.presentation.S_IR,
                req.body.button
            );

            module.exports.eventEmitter.emit('mysensors_send_message', message);

            res.send({message: "State changed", node: req.params.node, sensor: sensor.sensorId, state: req.body.button});
        });
    },
    /**
     * Change state of sensor
     *
     * @param req
     * @param res
     */
    putNodesSensorsState: function (req, res) {
        nodesDb.repository.findSensor(req.params.node, req.params.sensor, function(err, sensor) {
            if (err) {
                return res.status(404).send({code: 404, message: "Sensor not found"});
            }

            var message = MySensors.createMessage(
                req.params.node,
                sensor.id,
                MySensors.message.req,
                MySensors.value.V_STATUS,
                req.body.state
            );

            module.exports.eventEmitter.emit('mysensors_send_message', message);

            res.send({message: "State changed", node: req.params.node, sensor: sensor.id, state: req.body.state});
        });
    },
    /**
     * Get all sensors of one node
     *
     * @param req
     * @param res
     */
    cgetNodesSensors: function(req, res) {
        nodesDb.repository.findNode(req.params.node, function(err, node) {
            if (err) {
                return res.status(404).send({code: 404, message: "Node not found"});
            }

            res.send(node.sensors);
        });
    },
    /**
     * Get one sensors of one node
     *
     * @param req
     * @param res
     */
    getNodesSensors: function(req, res) {
        nodesDb.repository.findSensor(req.params.node, req.params.sensor, function(err, sensor) {
            if (err) {
                return res.status(404).send({code: 404, message: "Sensor not found"});
            }

            res.send(sensor);
        });
    },
    /**
     * Get all nodes
     *
     * @param req
     * @param res
     */
    cgetNodes: function(req, res) {
       nodesDb.repository.findAll(function(nodes) {
           res.send(nodes);
       });
    },
    /**
     * Get one node
     *
     * @param req
     * @param res
     */
    getNodes: function(req, res) {
        nodesDb.repository.findNode(req.params.node, function(err, node) {
            if (err) {
                return res.status(404).send({code: 404, message: "Node not found"});
            }

            res.send(node);
        });
    },
    /**
     * Get temperature from influx db
     * @param req
     * @param res
     */
    getNodesSensorsTemperature: function(req, res) {
        nodesDb.repository.findSensor(req.params.node, req.params.sensor, function(err, sensor) {
            if (err) {
                return res.status(404).send({code: 404, message: "Node not found"});
            }

            var query = 'SELECT last("payload") FROM "V_TEMP" WHERE "childSensorId" = \''+sensor.id+'\' AND time > now() - 6h';
            module.exports.influxClient.query(query, function(err, results) {
                if (results !== undefined && results.length > 0 && results[0].length > 0) {
                    res.send(results[0][0]);
                }
            });
        });
    },
    /**
     * Get humidity from influx db
     * @param req
     * @param res
     */
    getNodesSensorsHumidity: function(req, res) {
        nodesDb.repository.findSensor(req.params.node, req.params.sensor, function(err, sensor) {
            if (err) {
                return res.status(404).send({code: 404, message: "Node not found"});
            }

            var query = 'SELECT last("payload") FROM "V_HUM" WHERE "childSensorId" = \''+sensor.id+'\' AND time > now() - 6h';
            module.exports.influxClient.query(query, function(err, results) {
                if (results !== undefined && results.length > 0 && results[0].length > 0) {
                    res.send(results[0][0]);
                }
            });
        });
    },
    /**
     * Get power from influx db
     * @param req
     * @param res
     */
    getNodesSensorsPower: function(req, res) {
      var query = 'SELECT last("payload") FROM "V_WATT" WHERE time > now() - 6h';
      module.exports.influxClient.query(query, function(err, results) {
          if (results !== undefined && results.length > 0 && results[0].length > 0) {
              res.send(results[0][0]);
          }
      });
    },
    /**
     * Get period power from influx db
     * @param req
     * @param res
     */
    getNodesSensorsPeriodPower: function(req, res) {
      var query = 'SELECT last("payload") FROM "V_VAR1" WHERE "childSensorId" = \'8\' AND "nodeId" = \'1\' and time > now() - 6h';
      module.exports.influxClient.query(query, function(err, results) {
          if (results !== undefined && results.length > 0 && results[0].length > 0) {
              res.send(results[0][0]);
          }
      });
    },
    /**
     * Get state from influx db
     * @param req
     * @param res
     */
    getNodesSensorsState: function(req, res) {
        var self = this;

        nodesDb.repository.findSensor(req.params.node, req.params.sensor, function(err, sensor) {
            if (err) {
                return res.status(404).send({code: 404, message: "Node not found"});
            }

            var query = 'SELECT last("payload"), nodeId, childSensorId FROM "V_STATUS" WHERE "childSensorId" = \''+sensor.id+'\' and "nodeId" = \''+req.params.node+'\'';
            module.exports.influxClient.query(query, function(err, results) {
                if (results !== undefined && results.length > 0 && results[0].length > 0) {
                    res.send(results[0][0]);
                }
            });
        });
    }
};
