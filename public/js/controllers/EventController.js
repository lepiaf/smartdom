angular.module('smartdom.controller.event', [])
    .controller('EventController', function($scope, EventService) {
        $scope.labels = [];
        $scope.data = [[], []];
        $scope.selectedHour = false;

        $scope.init = function () {
            EventService.getTemp().then(function(response) {
                angular.forEach(response.data, function (value) {
                    var label = moment()
                        .year(value._id.year)
                        .month(value._id.month-1)
                        .date(value._id.day)
                        .hour(value._id.hour);

                    $scope.labels.push(label.toISOString());
                    $scope.data[0].push(value.avgHour.toFixed(2));
                });
            });

            EventService.getHum().then(function(response) {
                angular.forEach(response.data, function (value) {
                    $scope.data[1].push(value.avgHour.toFixed(2));
                });
            });
        };

        $scope.onClickGraphHour = function (event) {
            $scope.selectedHour = moment(event[0].label);
            $scope.labelsHour = [];
            $scope.dataHour = [[], []];

            EventService.getTempLastHour($scope.selectedHour.toISOString()).then(function(response) {
                angular.forEach(response.data, function (value) {
                    $scope.labelsHour.push(moment(event[0].label).minute(value._id.minute));
                    $scope.dataHour[0].push(value.avgMinute.toFixed(2));
                });
            });

            EventService.getHumLastHour($scope.selectedHour.toISOString()).then(function(response) {
                angular.forEach(response.data, function (value) {
                    $scope.dataHour[1].push(value.avgMinute.toFixed(2));
                });
            });

        }

    });
