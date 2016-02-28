angular.module('index', ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngResource'])
	.controller('indexController', controller)
	.config(config);

function controller($scope, $resource) {
	$scope.$inject = ['$scope', '$resource'];
	$scope.connect = connect;
	$scope.list = list;
    $scope.req = req;

	function connect() {
		$resource('/connect/:incubator').get({incubator: $scope.incubator}, callback);
		function callback(response) {
			if(response.success)
				$scope.host = true;
		}
	}

	function list() {
		$resource('/dev/list').get({}, callback);
		function callback(response) {
			console.log(response.list);
		}

	}
    
    function req() {
        $resource('/incubator/req').save({}, {test: 'ivo'}, callback);
		function callback(response) {
			console.log(response);
		}
    }
}

function config($compileProvider) {
	this.$inject = ["$compileProvider"];
	$compileProvider.aHrefSanitizationWhitelist(/:3000/);
}