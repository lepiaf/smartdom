angular.module('smartdom.service.authentication', []).factory('AuthenticationService', function() {
    return {
        isLogged: false,
        isAuthenticated: false
    };
});
