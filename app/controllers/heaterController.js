var MySensors = require('../services/MySensors');
var nodeId = 5;

var mapping = {
    chambre: {
        eco: [
            {node: nodeId, sensor: 1, state: 0},
            {node: nodeId, sensor: 2, state: 1}
        ],
        comfy: [
            {node: nodeId, sensor: 1, state: 1},
            {node: nodeId, sensor: 2, state: 0}
        ],
        stop: [
            {node: nodeId, sensor: 1, state: 0},
            {node: nodeId, sensor: 2, state: 0}
        ]
    },
    salonGauche: {
        eco: [
            {node: nodeId, sensor: 3, state: 0},
            {node: nodeId, sensor: 4, state: 1}
        ],
        comfy: [
            {node: nodeId, sensor: 3, state: 1},
            {node: nodeId, sensor: 4, state: 0}
        ],
        stop: [
            {node: nodeId, sensor: 3, state: 0},
            {node: nodeId, sensor: 4, state: 0}
        ]
    },
    salonDroite: {
        eco: [
            {node: nodeId, sensor: 5, state: 0},
            {node: nodeId, sensor: 6, state: 1}
        ],
        comfy: [
            {node: nodeId, sensor: 5, state: 1},
            {node: nodeId, sensor: 6, state: 0}
        ],
        stop: [
            {node: nodeId, sensor: 5, state: 0},
            {node: nodeId, sensor: 6, state: 0}
        ]
    }
};

module.exports = {
    influxClient: null,
    eventEmitter: null,
    putHeaterMode: function (req, res) {
        var mode = req.body.mode;
        var room = req.params.room;

        var message1 = MySensors.createMessage(
            5,
            mapping[room][mode][0].sensor,
            MySensors.messageType.set,
            20,
            mapping[room][mode][0].state
        );
        var message2 = MySensors.createMessage(
            5,
            mapping[room][mode][1].sensor,
            MySensors.messageType.set,
            20,
            mapping[room][mode][1].state
        );

        module.exports.eventEmitter.emit('mysensors_send_message', message1);
        module.exports.eventEmitter.emit('mysensors_send_message', message2);

        var influxPoint = {
            room: room,
            mode: mode
        };

        module.exports.influxClient.writePoint("heater", influxPoint, null, function(err, response) {});

        res.send({message: "State changed", mode: mode});

    },
    getHeaterMode: function(req, res) {
        var room = req.params.room;

        var query = 'SELECT last("mode") FROM "heater" WHERE "room" = \''+room+'\'';
        module.exports.influxClient.query(query, function(err, results) {
            res.send(results[0][0]);
        });
    }
};
