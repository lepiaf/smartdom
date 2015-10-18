/**
 * EventController
 *
 * @description :: Server-side logic for managing Events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    list: function (req, res) {


        Event
            .find({
                subType: "V_TEMP",
                createdAt: {'>=': '2015-10-18T10:00:00.000'}
            })
            .sort({createdAt: -1}).limit(5000).exec(function(err, data){

            return res.json(data);
        });
    }
};

