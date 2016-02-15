angular.module('MainCtrl', []).controller('MainController', ['$scope', 'NodeService', function($scope, NodeService) {
    $scope.sendButton = function (sensor, state) {
        NodeService.putNodesSensorsButton(3, sensor, state);
    };

}]);
