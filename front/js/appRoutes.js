// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController',
            access: { requiredLogin: true }
        })
        .when('/events', {
            templateUrl: 'views/event.html',
            controller: 'EventController',
            access: { requiredLogin: true }
        })
        .when('/nodes/:nodeId', {
            templateUrl: 'views/sensor/list.html',
            controller: 'SensorController',
            access: { requiredLogin: true }
        })
        .when('/nodes/:nodeId/sensor/:sensor', {
            templateUrl: 'views/sensor/one.html',
            controller: 'SensorController',
            access: { requiredLogin: true }
        })
        .when('/nodes', {
            templateUrl: 'views/node/list.html',
            controller: 'NodeController',
            access: { requiredLogin: true }
        })
        .when('/login', {
            templateUrl: 'views/login/login.html',
            controller: 'LoginController',
            access: { requiredLogin: false }
        });

    $locationProvider.html5Mode(true);

}]);
