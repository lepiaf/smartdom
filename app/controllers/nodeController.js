var Node = require('../models/node');
var moment = require('moment');
var _ = require('lodash');
var events = require('events');
var eventEmitter = new events.EventEmitter();


module.exports = {
    /**
     * Get one sensors in gateway
     *
     * @param req
     * @param res
     */
    getNodesOneSensor: function(req, res) {
        Node.findOne({nodeId: req.params.nodeId}, function(err, result) {
            if (err) {
                res.send(err);
            }

            res.send(result);
        });
    },
    /**
     * Get all nodes
     *
     * @param req
     * @param res
     */
    getNodes: function(req, res) {
        eventEmitter.emit('mysensors_send_message', "2;1;1;0;2;0\n");
        Node.find(function(err, result) {
            if (err) {
                res.send(err);
            }

            res.send(result);
        });
    },
    /**
     * Get all nodes
     *
     * @param req
     * @param res
     */
    getNode: function(req, res) {
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
