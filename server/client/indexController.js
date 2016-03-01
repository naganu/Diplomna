(function () {
    'use strict';

    function controller($scope, $resource) {
        $scope.connect = connect;

        function connect() {
            $resource('/connect/:incubator').get({incubator: $scope.incubator}, function (response) {
                if(response.success)
                    $scope.host = true;
            });
        }
    }
    
    controller.$inject = ['$scope', '$resource'];
    
    angular.module('incubator').controller('indexController', controller);
})()