angular.module('MainCtrl', []).controller('MainController', [
    '$scope', 'NodeService', 'KodiService', 'HeaterService',
    function($scope, NodeService, KodiService, HeaterService) {
    $scope.sendButton = function (node, sensor, state) {
        NodeService.putNodesSensorsButton(node, sensor, state);
    };

    $scope.changeState = function (node, sensor, state) {
        NodeService.putNodesSensorsState(node,sensor,state);
    };

    $scope.temperature = {
        salon: 0,
        chambre: 0
    }

    NodeService.getNodesSensorTemperature(4,5).then(function(res){
        $scope.temperature.salon = res.data.last;
    });

    NodeService.getNodesSensorTemperature(0,3).then(function(res){
        $scope.temperature.chambre = res.data.last;
    });

    $scope.heaterService = HeaterService;

    $scope.kodi = KodiService;

}]);
