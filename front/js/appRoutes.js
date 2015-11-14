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
    ;

    $locationProvider.html5Mode(true);

}]);
