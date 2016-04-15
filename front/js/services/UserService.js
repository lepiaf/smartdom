angular.module('smartdom.service.user', []).factory('UserService', function($http) {
    return {
        logIn: function(username, password) {
            return $http.post('/api/authenticate', {username: username, password: password});
        }
    }
});