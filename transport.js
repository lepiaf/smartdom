var moment = require('moment');
var qs = require('querystring');
var request = require('request');
var jsdom = require("jsdom");
var momentjs = require('momentjs');
var influx = require('influx');
var influxTransport = influx({
    host: 'localhost',
    username: 'transport',
    password: 'transport',
    database: 'transport'
});

var form = {
    nomGare: 'ABLON'
};
var formData = qs.stringify(form);
var contentLength = formData.length;
getRerC();
setInterval(getBus126, 60000);
setInterval(getRerC, 5 * 60000);

function getRerC() {
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
            window.$('.recherche-horaires-resultats').find('tr').not('.stops').each(function(v, k) {
                var timeElement = window.$(k).find('td')[1];
                var destinationElement = window.$(k).find('td')[2];
                var trackElement = window.$(k).find('td')[3];
                var time = window.$(timeElement).text().trim();
                if (time == "") {
                    return;
                }
                var time = time.split(':');
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
                }
                console.log(rerPoint);

                influxTransport.writePoint("rerc", rerPoint, null, function(err, response) {});
            });

        });
    });
}

function getBus126() {
    jsdom.env(
        "http://www.ratp.fr/horaires/fr/ratp/bus/prochains_passages/PP/B126/126_58_92/R", ["https://code.jquery.com/jquery-2.2.4.min.js"],
        function(err, window) {
            var passage1 = window.$('fieldset.bus > table:nth-child(5) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)').text();
            var passage2 = window.$('fieldset.bus > table:nth-child(5) > tbody:nth-child(2) > tr:nth-child(2) > td:nth-child(2)').text();

            var influxPoint = {
                firstPass: passage1,
                secondPass: passage2,
                time: new Date()
            };
            influxTransport.writePoint("bus126", influxPoint, null, function(err, response) {});
            console.log(passage1 + '; ' + passage2);

        }
    );
}
