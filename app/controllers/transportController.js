var Transport = require('../services/Transport');

module.exports = {
    influxClient: null,
    eventEmitter: null,
    getTransport: function (req, res) {
        Transport.getRerC.then(function(rerCData) {
            Transport.getBus126.then(function(bus126Data) {
                res.send({
                    bus: bus126Data,
                    rerc: rerCData
                });
            });
        });
    }
}
