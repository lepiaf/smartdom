'use strict';

angular.module('smartdomApp.view1', ['ngRoute', 'ngResource', "chart.js"])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'pages/view1/templates/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$resource', function($scope, $resource) {
    $scope.events = [];
    $scope.labels = [];
    $scope.data = [[]];
    var eventResource = $resource('/api/v1/events');
    eventResource.query(function(data) {
        $scope.events = data;

        angular.forEach(data, function(value, key) {
            $scope.labels.push(key);
            $scope.data[0].push(value.payload);
        })
  });
}]);