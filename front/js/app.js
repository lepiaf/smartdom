angular.module('smartdomApp', [
    'ngRoute',
    'appRoutes',

    'ngAnimate',
    'ngSanitize',
    'ngToast',

    'MainCtrl',
    'smartdom.service.authentication',
    'smartdom.service.user',
    'smartdom.interceptor.token',
    'smartdom.service.kodi',
    'smartdom.service.node',
    'smartdom.service.heater',
    'smartdom.controller.node',
    'smartdom.controller.sensor',
    'smartdom.controller.login'

]).config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
        animation: 'fade' // or 'fade'
    });
}]).config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
}).run(function($rootScope, $location, $window) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute) {
        if (nextRoute.access.requiredLogin && !$window.localStorage.token) {
            $location.path("/login");
        }
    });
});