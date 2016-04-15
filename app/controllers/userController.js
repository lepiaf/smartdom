var userRepository = require('../repository/userRepository');
var config = require('../../config/config.js');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');

module.exports = {
    authenticate: function(req, res) {
        userRepository.findOne(req.body.username, function(err, user) {
            if (err) return res.status(404).json({message: "Cannot find user"});

            bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
                if (err || !isMatch) {
                    return res.status(400).json({message:"Failed to authenticate user"});
                }

                var token = jwt.encode(user, config.secret);
                res.json({token: "JWT "+token});
            });
        });
    },
    signup: function(req, res) {
        if (!req.body.password) {
            return res.status(400).json({message:"Password field is required"});
        }

        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return res.status(500).json({message:"Failed to created user"});
            }

            bcrypt.hash(req.body.password, salt, function (err, hash) {
                if (err) {
                    return res.status(500).json({message:"Failed to created user"});
                }

                return res.status(201).json({hash:hash, salt: salt});
            });
        });
    }
}