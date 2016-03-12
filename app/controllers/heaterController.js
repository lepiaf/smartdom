var MySensors = require('../services/MySensors');
var nodeId = 5;

module.exports = {
    influxClient: null,
    eventEmitter: null,
    mapping: {
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
    },
    putHeaterMode: function (req, res) {
        var mode = req.body.mode;
        var room = req.params.room;

        module.exports.changeHeaterMode(room, mode);

        res.send({message: "State changed", mode: mode});

    },
    changeHeaterMode: function(room, mode) {
        console.info("Change heater mode to "+mode+" for "+room);
        var message1 = MySensors.createMessage(
            5,
            module.exports.mapping[room][mode][0].sensor,
            MySensors.messageType.set,
            MySensors.valueType.V_STATUS,
            module.exports.mapping[room][mode][0].state
        );
        var message2 = MySensors.createMessage(
            5,
            module.exports.mapping[room][mode][1].sensor,
            MySensors.messageType.set,
            MySensors.valueType.V_STATUS,
            module.exports.mapping[room][mode][1].state
        );

        module.exports.eventEmitter.emit('mysensors_send_message_heater', message1, message2);

        var influxPoint = {
            room: room,
            mode: mode
        };

        console.info("Heater point: "+ JSON.stringify(influxPoint));

        module.exports.influxClient.writePoint("heater", influxPoint, null, function(err, response) {});
    },
    getHeaterMode: function(req, res) {
        var room = req.params.room;

        var query = 'SELECT last("mode") FROM "heater" WHERE "room" = \''+room+'\'';
        module.exports.influxClient.query(query, function(err, results) {
            res.send(results[0][0]);
        });
    }
};
