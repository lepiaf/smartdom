angular.module('smartdom.service.heater', []).factory('HeaterService', ['NodeService', 'ngToast','$http', function(NodeService, ngToast, $http) {
    var nodeId = 5;

    var mapping = {
        chambre: {
            eco: [
                {node: nodeId, sensor: 1, state: 0},
                {node: nodeId, sensor: 2, state: 1}
            ],
                comfy: [
                {node: nodeId, sensor: 1, state: 1},
                {node: nodeId, sensor: 2, state: 0}
            ],
                stop: [
                {node: nodeId, sensor: 1, state: 0},
                {node: nodeId, sensor: 2, state: 0}
            ]
        },
        salonGauche: {
            eco: [
                {node: nodeId, sensor: 3, state: 0},
                {node: nodeId, sensor: 4, state: 1}
            ],
            comfy: [
                {node: nodeId, sensor: 3, state: 1},
                {node: nodeId, sensor: 4, state: 0}
            ],
            stop: [
                {node: nodeId, sensor: 3, state: 0},
                {node: nodeId, sensor: 4, state: 0}
            ]
        },
        salonDroite: {
            eco: [
                {node: nodeId, sensor: 5, state: 0},
                {node: nodeId, sensor: 6, state: 1}
            ],
            comfy: [
                {node: nodeId, sensor: 5, state: 1},
                {node: nodeId, sensor: 6, state: 0}
            ],
            stop: [
                {node: nodeId, sensor: 5, state: 0},
                {node: nodeId, sensor: 6, state: 0}
            ]
        }
    };

    var resource = {
        getHeaterMode : function(room) {
            return $http.get('/api/heaters/'+room);
        },
        putHeaterMode : function(room, mode) {
            return $http.put('/api/heaters/'+room, {mode: mode});
        }
    };

    return {
        resource:resource,
        setEco : function(room) {
            resource.putHeaterMode(room, 'eco');

            ngToast.create({
                className: 'success',
                content: 'Mode "eco" pour le radiateur "'+room+'"'
            });
        },
        setComfy : function(room) {
            resource.putHeaterMode(room, 'comfy');

            ngToast.create({
                className: 'success',
                content: 'Mode "confort" pour le radiateur "'+room+'"'
            });
        },
        setStop : function(room) {
            resource.putHeaterMode(room, 'stop');

            ngToast.create({
                className: 'success',
                content: 'Mode "arrêt" pour le radiateur "'+room+'"'
            });
        }
    }

}]);
