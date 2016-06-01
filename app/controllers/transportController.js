var Transport = require('../services/Transport');

module.exports = {
    influxClient: null,
    eventEmitter: null,
    getTransport: function (req, res) {
        Transport.getBus126.then(function(data) {
            Transport.getRerC.then(function(rerCData) {
                res.send({
                    bus126: data,
                    rerc: rerCData
                });
            });

        })
    }
}
