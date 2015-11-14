angular.module('smartdom.controller.node', [])
    .controller('NodeController', ['$scope', 'NodeService', function($scope, NodeService) {

        NodeService.getNodes().then(function(response){
            $scope.nodes = response.data;
        })
    }]);
