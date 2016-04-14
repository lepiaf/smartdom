var request = require('request');
var config = require('../../config/config.js');

/**
 * Act as proxy
 */
module.exports = {
    post: function (req, res) {
        request.post({
            url: config.kodi + '/jsonrpc?'+req.query.method,
            json: req.body
        }, function (err, resp, body) {
            res.send(resp);
        });
    }
}
