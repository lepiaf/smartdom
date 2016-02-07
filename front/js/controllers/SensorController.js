angular.module('smartdom.controller.sensor', [])
    .controller('SensorController', ['$scope', 'NodeService', '$routeParams', function($scope, NodeService, $routeParams) {

        $scope.sensor = {};
        $scope.nodeSensor = {};
        $scope.nodeId = $routeParams.nodeId;

        NodeService.getNodesSensors($routeParams.nodeId).then(function(response) {
            $scope.nodeSensor = response.data.childSensors;
        });

        if ($routeParams.sensor) {
            NodeService.getNodesSensor($routeParams.nodeId, $routeParams.sensor).then(function(response) {
                $scope.sensor = response.data;
            });
        }

        $scope.changeState = function (state) {
            NodeService.putNodesSensorsState($routeParams.nodeId, $routeParams.sensor, state);
        }

    }]);
