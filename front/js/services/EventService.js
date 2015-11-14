angular.module('smartdom.service.event', []).factory('EventService', ['$http', function($http) {

    return {
        getTemp : function() {
            return $http.get('/api/events/V_TEMP');
        },
        getHum: function() {
            return $http.get('/api/events/V_HUM');
        },
        getTempLastHour : function(hour) {
            return $http.get('/api/events/V_TEMP/lastHour/'+hour);
        },
        getHumLastHour: function(hour) {
            return $http.get('/api/events/V_HUM/lastHour/'+hour);
        }
    }

}]);
