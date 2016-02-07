angular.module('smartdom.service.node', []).factory('NodeService', ['$http', function($http) {

    return {
        getNodes : function() {
            return $http.get('/api/nodes');
        },
        getNodesSensors: function(nodeId) {
            if (!nodeId) {
                return;
            }

            return $http.get('/api/nodes/'+nodeId);
        },
        getNodesSensor: function(nodeId, sensorId) {
            if (!nodeId || !sensorId) {
                return;
            }

            return $http.get('/api/nodes/'+nodeId+'/sensors/'+sensorId);
        },
        putNodesSensorsState: function(nodeId, sensorId, state) {
            if (!nodeId || !sensorId || !state) {
                return;
            }
            return $http.put('/api/nodes/'+nodeId+'/sensors/'+sensorId, {state: state});
        }
    }
}]);
