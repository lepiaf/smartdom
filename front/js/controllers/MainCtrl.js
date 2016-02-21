angular.module('MainCtrl', []).controller('MainController', ['$scope', 'NodeService', 'KodiService', function($scope, NodeService, KodiService) {
    $scope.sendButton = function (sensor, state) {
        NodeService.putNodesSensorsButton(3, sensor, state);
    };

    $scope.kodi = KodiService;

}]);
