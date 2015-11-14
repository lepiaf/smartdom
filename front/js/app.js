angular.module('smartdomApp', [
    'ngRoute',
    'appRoutes',
    'MainCtrl',
    'smartdom.service.node',
    'smartdom.service.event',
    'smartdom.controller.event',
    'smartdom.controller.node',
    'smartdom.controller.sensor',

    'chart.js'
]);
