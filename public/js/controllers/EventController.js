angular.module('smartdom.controller.event', [])
    .controller('EventController', function($scope, EventService) {
        $scope.labels = [];
        $scope.data = [[], []];

        EventService.getTemp().then(function(response) {
            angular.forEach(response.data, function (value) {
                $scope.labels.push(value._id.hour+":00");
                $scope.data[0].push(value.avgHour.toFixed(2));
            });
        });

        EventService.getHum().then(function(response) {
            angular.forEach(response.data, function (value) {
                $scope.data[1].push(value.avgHour.toFixed(2));
            });
        });

    });
