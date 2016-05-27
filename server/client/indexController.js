(function () {
    'use strict';

    function controller($scope, $resource, $mdDialog, $translate) {
        $scope.language = "bg";
        $scope.chooseLanguage = chooseLanguage;
        $scope.chooseLanguage($scope.language);
        //$scope.connect = connect;
        $scope.host = true;

        /*function connect() {
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
        }*/

        function chooseLanguage(language) {
            $translate.use(language);
        }
    }

    controller.$inject = ['$scope', '$resource', '$mdDialog', '$translate'];

    angular.module('incubator').controller('indexController', controller);
})()
