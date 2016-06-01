var Transport = require('../services/Transport');

module.exports = {
    influxClient: null,
    eventEmitter: null,
    getTransport: function (req, res) {
        Transport.getBus126.then(function(data) {
            res.send(data);
        })
    }
}
