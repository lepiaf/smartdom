var users = require("../../database/users.js");

module.exports = {
    findOne: function(username, callback) {
        for (var i in users) {
            if (users[i].username === username) {
                return callback(false, users[i]);
            }
        }

        callback(true, null);
    }
}