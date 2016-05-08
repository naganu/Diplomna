(function () {
    'use strict';

    function controller($scope, $resource, $mdDialog) {
        $scope.connect = connect;

        function connect() {
            $resource('/connect/:incubator').get({incubator: $scope.incubator}, function (response) {
                if(response.success) {
                    $scope.host = true;
                } else {
                    $mdDialog.show(
    					$mdDialog.alert()
    						.textContent("Incubator not found!")
    						.ok("Okay")
    						.theme("on_off")
    				);
                }
            });
        }
    }

    controller.$inject = ['$scope', '$resource', '$mdDialog'];

    angular.module('incubator').controller('indexController', controller);
})()
