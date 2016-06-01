var moment = require('moment');
var qs = require('querystring');
var request = require('request');
var jsdom = require("jsdom");
var Promise = require('promise');
var async = require("async");

var form = {
    nomGare: 'ISSY VAL DE SEINE'
};
var formData = qs.stringify(form);
var contentLength = formData.length;
var vm = this;
vm.bus126 = {};
vm.rerc = [];


var getBus126 = new Promise(function (resolve, reject) {
    jsdom.env(
        "http://www.ratp.fr/horaires/fr/ratp/bus/prochains_passages/PP/B126/126_58_92/R", ["https://code.jquery.com/jquery-2.2.4.min.js"],
        function(err, window) {
            var passage1 = window.$('fieldset.bus > table:nth-child(5) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)').text();
            var passage2 = window.$('fieldset.bus > table:nth-child(5) > tbody:nth-child(2) > tr:nth-child(2) > td:nth-child(2)').text();

            resolve({
                firstPass: passage1,
                secondPass: passage2
            });

            console.log(passage1 + '; ' + passage2);
        }
    );
});

var rerData = [];
var getRerC = new Promise(function (resolve, reject) {
    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: "https://www.transilien.com/tempsreel/prochaindeparts/recherchehoraires",
        method: 'POST',
        body: formData
    }, function(err, res, body) {
        jsdom.env(body, ["https://code.jquery.com/jquery-2.2.4.min.js"], function(err, window) {
            async.forEachOf(
                window.$('.recherche-horaires-resultats').find('tr').not('.stops'),
                function (item, k, callback) {
                    var timeElement = window.$(item).find('td')[1];
                    var destinationElement = window.$(item).find('td')[2];
                    var trackElement = window.$(item).find('td')[3];
                    var time = window.$(timeElement).text().trim();
                    if (time == "") {
                        return;
                    }

                    time = time.split(':');
                    var arriveAt = moment().minutes(time[1]).hours(time[0]).second(0).millisecond(0);
                    if (moment().hours() > time[0]) {
                        arriveAt.add(1, 'day');
                    }

                    var rerPoint = {
                        arriveAt: arriveAt.toISOString(),
                        arriveAtRaw: window.$(timeElement).text().trim(),
                        destination: window.$(destinationElement).text().trim(),
                        track: window.$(trackElement).text().trim(),
                        time: new Date()
                    };
                    rerData.push(rerPoint);

                    callback();
                },
                function () {
                    console.log(rerData);
                    resolve(rerData);
                }
            );
        });
    });
});

module.exports = {
    getBus126: getBus126,
    getRerC: getRerC
};
