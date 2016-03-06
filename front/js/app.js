angular.module('smartdomApp', [
    'ngRoute',
    'appRoutes',
    'MainCtrl',
    'smartdom.service.kodi',
    'smartdom.service.node',
    'smartdom.service.heater',
    'smartdom.service.event',
    'smartdom.controller.event',
    'smartdom.controller.node',
    'smartdom.controller.sensor',

    'chart.js'
]);
