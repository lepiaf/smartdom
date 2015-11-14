angular.module('smartdom.service.node', []).factory('NodeService', ['$http', function($http) {

    return {
        getNodes : function() {
            return $http.get('/api/nodes');
        },
        getNodesSensors: function(nodeId) {
            return $http.get('/api/nodes/'+nodeId);
        }
    }
}]);
