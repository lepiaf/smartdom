var JwtStrategy = require('passport-jwt').Strategy;

var userRepository = require("./repository/userRepository.js");
var config = require('../config/config.js');

module.exports = function(passport) {
    var opts = {};
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        userRepository.findOne(jwt_payload.username, function(err, user) {
            if (err) {
                done(err, false);
            }

            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};