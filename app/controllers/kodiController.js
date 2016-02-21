var request = require('request');

/**
 * Act as proxy
 */
module.exports = {
    post: function (req, res) {
        request.post({
            url: 'http://192.168.1.94/jsonrpc?'+req.query.method,
            json: req.body
        }, function (err, resp, body) {
            res.send(resp);
        });
    }
}