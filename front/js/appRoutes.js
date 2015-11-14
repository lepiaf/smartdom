// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        .when('/events', {
            templateUrl: 'views/event.html',
            controller: 'EventController'
        })
        .when('/nodes/:nodeId', {
            templateUrl: 'views/sensor/list.html',
            controller: 'SensorController'
        })
        .when('/nodes', {
            templateUrl: 'views/node/list.html',
            controller: 'NodeController'
        })
    ;

    $locationProvider.html5Mode(true);

}]);
