angular.module('smartdom.controller.event', [])
    .controller('EventController', function($scope, EventService) {
        $scope.labels = [];
        $scope.data = [[]];

        EventService.get().then(function(response) {

            angular.forEach(response.data, function (value) {
                    $scope.labels.push(value._id.hour);
                    $scope.data[0].push(value.avgMinute);
                });
        });

});
