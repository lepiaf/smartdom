angular.module('smartdom.service.heater', []).factory('HeaterService', ['NodeService', function(NodeService) {
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
    return {

        setEco : function(room) {
            NodeService.putNodesSensorsState(
                mapping[room].eco[0].node,
                mapping[room].eco[0].sensor,
                mapping[room].eco[0].state
            );

            NodeService.putNodesSensorsState(
                mapping[room].eco[1].node,
                mapping[room].eco[1].sensor,
                mapping[room].eco[1].state
            );
        },
        setComfy : function(room) {
            NodeService.putNodesSensorsState(
                mapping[room].comfy[0].node,
                mapping[room].comfy[0].sensor,
                mapping[room].comfy[0].state
            );

            NodeService.putNodesSensorsState(
                mapping[room].comfy[1].node,
                mapping[room].comfy[1].sensor,
                mapping[room].comfy[1].state
            );
        },
        setStop : function(room) {
            NodeService.putNodesSensorsState(
                mapping[room].stop[0].node,
                mapping[room].stop[0].sensor,
                mapping[room].stop[0].state
            );

            NodeService.putNodesSensorsState(
                mapping[room].stop[1].node,
                mapping[room].stop[1].sensor,
                mapping[room].stop[1].state
            );
        }
    }

}]);
