angular.module('smartdom.service.event', []).factory('EventService', ['$http', function($http) {

    return {
        // call to get all nerds
        getTemp : function() {
            return $http.get('/api/events/V_TEMP');
        },
        getHum: function() {
            return $http.get('/api/events/V_HUM');
        }
    }

}]);
