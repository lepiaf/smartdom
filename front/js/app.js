angular.module('smartdomApp', [
    'ngRoute',
    'appRoutes',

    'ngAnimate',
    'ngSanitize',
    'ngToast',

    'MainCtrl',
    'smartdom.service.kodi',
    'smartdom.service.node',
    'smartdom.service.heater',
    'smartdom.controller.node',
    'smartdom.controller.sensor'

]).config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
        animation: 'fade' // or 'fade'
    });
}]);
