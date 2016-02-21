angular.module('smartdom.service.kodi', []).factory('KodiService', ['$http', function($http) {
    var host = "/api/kodi?method=";
    return {

        right: function() {
            return this.postInput("Right");
        },
        up: function() {
            return this.postInput("Up");
        },
        left: function() {
            return this.postInput("Left");
        },
        down: function() {
            return this.postInput("Down");
        },
        postInput: function (input) {
            return $http.post(host+'Input.'+input, {"jsonrpc":"2.0","method":"Input."+input,"id":1});
        },
        setVolumeLow: function () {
            return $http.post(host+'Application.SetVolume', {"jsonrpc":"2.0","method":"Application.SetVolume","id":1,"params":{"volume":"decrement"}});
        },
        setVolumeHigh: function () {
            return $http.post(host+'Application.SetVolume', {"jsonrpc":"2.0","method":"Application.SetVolume","id":1,"params":{"volume":"increment"}});
        },
        mute: function () {
            return $http.post(host+'Application.SetMute', {"jsonrpc":"2.0","method":"Application.SetMute","id":1,"params":{"mute":"toggle"}});
        },
        enter: function () {
            return this.postInput("Select");
        },
        back: function () {
            return this.postInput("Back");
        },
        playPause: function () {
            return $http.post(host+'Player.PlayPause', {"jsonrpc":"2.0","method":"Player.PlayPause","id":1,"params":{"playerid":1}});
        },
        stop: function () {
            return $http.post(host+'Player.Stop', {"jsonrpc":"2.0","method":"Player.Stop","id":1,"params":{"playerid":1}});
        },
        poweroff: function () {
            return $http.post(host+'System.Shutdown', {"jsonrpc":"2.0","method":"Player.Stop","id":1,"params":{"playerid":1}});
        }
    }
}]);
