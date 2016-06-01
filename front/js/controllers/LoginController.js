angular.module('smartdom.controller.login', []).controller('LoginController', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function($scope, $location, $window, UserService, AuthenticationService) {

        $scope.logIn = function logIn(username, password) {
            if (username !== undefined && password !== undefined) {
                UserService.logIn(username, password).success(function(data) {
                    AuthenticationService.isLogged = true;
                    $window.localStorage.token = data.token;
                    $location.path("/");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }

        $scope.logout = function logout() {
            if (AuthenticationService.isLogged) {
                AuthenticationService.isLogged = false;
                delete $window.localStorage.token;
                $location.path("/");
            }
        }
    }
]);