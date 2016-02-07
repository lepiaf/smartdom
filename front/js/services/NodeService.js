angular.module('smartdom.service.node', []).factory('NodeService', ['$http', function($http) {

    return {
        getNodes : function() {
            return $http.get('/api/nodes');
        },
        getNodesSensors: function(nodeId) {
            return $http.get('/api/nodes/'+nodeId);
        },
        getNodesSensor: function(nodeId, sensorId) {
            return $http.get('/api/nodes/'+nodeId+'/sensors/'+sensorId);
        },
        putNodesSensorsState: function(nodeId, sensorId, state) {
            return $http.put('/api/nodes/'+nodeId+'/sensors/'+sensorId, {state: state});
        }
    }
}]);
