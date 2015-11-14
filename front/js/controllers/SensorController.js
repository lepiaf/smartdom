angular.module('smartdom.controller.sensor', [])
    .controller('SensorController', ['$scope', 'NodeService', function($scope, NodeService) {

        NodeService.getNodesSensors(0).then(function(response) {
            console.log(response.data);
            $scope.nodeSensor = response.data.childSensors;
        })
    }]);
