angular.module('smartdom.service.event', []).factory('EventService', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/events');
        }
    }

}]);
