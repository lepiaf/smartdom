/**
 * EventController
 *
 * @description :: Server-side logic for managing Events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    list: function (req, res) {
        Event.find({subType: "V_TEMP"}).exec(function(err, data){
            return res.json(data);
        });
    }
};

