var Transport = require('../services/Transport');

module.exports = {
    influxClient: null,
    eventEmitter: null,
    getTransport: function (req, res) {
        Transport.getRerC.then(function(rerCData) {
            res.send({
                rerc: rerCData
            });

        })
    }
}
