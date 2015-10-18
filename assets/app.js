'use strict';

// Declare app level module which depends on views, and components
angular.module('smartdomApp', [
  'ngRoute',
  'smartdomApp.view1',
  'smartdomApp.view2'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
