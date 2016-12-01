angular.module('MainCtrl', []).controller('MainController', [
    '$scope', 'NodeService', 'KodiService', 'HeaterService', 'ngToast', 'AuthenticationService', '$window', '$location', '$http',
    function($scope, NodeService, KodiService, HeaterService, ngToast, AuthenticationService, $window, $location, $http) {

        $scope.temperature = {
            salon: 0,
            chambre: 0
        };

        $scope.heater = {
            chambre: "Arrêt",
            salonDroite: "Arrêt",
            salonGauche: "Arrêt"
        };

        $scope.transport = [];

        $scope.init = function () {
            if (!$window.localStorage.token) {
                return;
            }

            NodeService.getNodesSensorTemperature(4,5).then(function(res){
                $scope.temperature.salon = res.data.last;

                NodeService.getNodesSensorTemperature(7,3).then(function(res){
                     $scope.temperature.chambre = res.data.last;
                 });
            });

            HeaterService.resource.getHeaterMode("chambre").then(function(res) {
                $scope.heater.chambre = res.data.last;

                HeaterService.resource.getHeaterMode("salonGauche").then(function(res) {
                    $scope.heater.salonGauche = res.data.last;

                    HeaterService.resource.getHeaterMode("salonDroite").then(function(res) {
                        $scope.heater.salonDroite = res.data.last;
                    });
                });
            });
        };

        $scope.getClassByRoom = function(room) {
            if ($scope.heater[room] === "eco") {
                return "label-success";
            }

            if ($scope.heater[room] === "comfy") {
                return "label-warning";
            }

            return "label-danger";
        };


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

        $scope.logout = function() {
            delete $window.localStorage.token;
            $location.path("/login");
        };
}]);
