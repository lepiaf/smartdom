var MySensors = require('../services/MySensors');

var node = {
    id: 5,
    sensor: {
        chambre: [1,2],
        salonGauche: [3,4],
        salonDroite: [5,6]
    }
};

module.exports = {
    info: node,
    influxClient: null,
    eventEmitter: null,
    mapping: {
        chambre: {
            eco: [
                {node: node.id, sensor: node.sensor.chambre[0], state: 0},
                {node: node.id, sensor: node.sensor.chambre[1], state: 1}
            ],
            comfy: [
                {node: node.id, sensor: node.sensor.chambre[0], state: 1},
                {node: node.id, sensor: node.sensor.chambre[1], state: 0}
            ],
            stop: [
                {node: node.id, sensor: node.sensor.chambre[0], state: 0},
                {node: node.id, sensor: node.sensor.chambre[1], state: 0}
            ]
        },
        salonGauche: {
            eco: [
                {node: node.id, sensor: node.sensor.salonGauche[0], state: 0},
                {node: node.id, sensor: node.sensor.salonGauche[1], state: 1}
            ],
            comfy: [
                {node: node.id, sensor: node.sensor.salonGauche[0], state: 1},
                {node: node.id, sensor: node.sensor.salonGauche[1], state: 0}
            ],
            stop: [
                {node: node.id, sensor: node.sensor.salonGauche[0], state: 0},
                {node: node.id, sensor: node.sensor.salonGauche[1], state: 0}
            ]
        },
        salonDroite: {
            eco: [
                {node: node.id, sensor: node.sensor.salonDroite[0], state: 0},
                {node: node.id, sensor: node.sensor.salonDroite[1], state: 1}
            ],
            comfy: [
                {node: node.id, sensor: node.sensor.salonDroite[0], state: 1},
                {node: node.id, sensor: node.sensor.salonDroite[1], state: 0}
            ],
            stop: [
                {node: node.id, sensor: node.sensor.salonDroite[0], state: 0},
                {node: node.id, sensor: node.sensor.salonDroite[1], state: 0}
            ]
        }
    },
    putHeaterMode: function (req, res) {
        var mode = req.body.mode;
        var room = req.params.room;

        module.exports.changeHeaterMode(room, mode);

        res.send({message: "State changed", mode: mode});
    },
    getHeaterMode: function(req, res) {
        var room = req.params.room;

        var query = 'SELECT last("mode") FROM "heater" WHERE "room" = \''+room+'\'';
        module.exports.influxClient.query(query, function(err, results) {
            if (results !== undefined && results.length > 0 && results[0].length > 0) {
                res.send(results[0][0]);
            }
        });
    },
    changeHeaterMode: function(room, mode) {
        console.info("Change heater mode to "+mode+" for "+room);
        var message1 = MySensors.createMessage(
            node.id,
            module.exports.mapping[room][mode][0].sensor,
            MySensors.message.set,
            MySensors.value.V_STATUS,
            module.exports.mapping[room][mode][0].state
        );
        var message2 = MySensors.createMessage(
            node.id,
            module.exports.mapping[room][mode][1].sensor,
            MySensors.message.set,
            MySensors.value.V_STATUS,
            module.exports.mapping[room][mode][1].state
        );

        module.exports.eventEmitter.emit('mysensors_send_message_heater', message1, message2);

        var influxPoint = {
            room: room,
            mode: mode
        };

        console.info("Heater point: "+ JSON.stringify(influxPoint));

        module.exports.influxClient.writePoint("heater", influxPoint, null, function(err, response) {});
    }
};
