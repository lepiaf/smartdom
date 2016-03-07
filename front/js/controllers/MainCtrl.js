angular.module('MainCtrl', []).controller('MainController', [
    '$scope', 'NodeService', 'KodiService', 'HeaterService', 'ngToast',
    function($scope, NodeService, KodiService, HeaterService, ngToast) {

        $scope.temperature = {
            salon: 0,
            chambre: 0
        }

        $scope.init = function () {
            NodeService.getNodesSensorTemperature(4,5).then(function(res){
                $scope.temperature.salon = res.data.last;
            });

            NodeService.getNodesSensorTemperature(0,3).then(function(res){
                $scope.temperature.chambre = res.data.last;
            });

        }


        $scope.sendButton = function (node, sensor, state) {
            NodeService.putNodesSensorsButton(node, sensor, state);

            ngToast.create({
                className: 'success',
                content: 'Bouton appuyé'
            });
        };

        $scope.changeState = function (node, sensor, state) {
            NodeService.putNodesSensorsState(node,sensor,state);

            ngToast.create({
                className: 'success',
                content: 'Etat modifié à '+ (state ? 'on' : 'off')
            });

        };

        $scope.heaterService = HeaterService;

        $scope.kodi = KodiService;

        setInterval(function(){
            $scope.init();
        }, 5000);

}]);
