angular.module('smartdom.controller.event', [])
    .controller('EventController', function($scope, EventService) {
        $scope.labels = [];
        $scope.data = [[]];

        $scope.labelsHum = [];
        $scope.dataHum = [[]];

        EventService.getTemp().then(function(response) {

            angular.forEach(response.data, function (value) {
                    $scope.labels.push(value._id.hour);
                    $scope.data[0].push(value.avgHour.toFixed(2));
                });
        });

        EventService.getHum().then(function(response) {

            angular.forEach(response.data, function (value) {
                $scope.labelsHum.push(value._id.hour);
                $scope.dataHum[0].push(value.avgHour.toFixed(2));
            });
        });

});
