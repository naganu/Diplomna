angular.module('index', ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngResource'])
	.controller('indexController', controller)
	.config(config);

function controller($scope, $resource) {
	$scope.$inject = ['$scope', '$resource'];
	$scope.connect = connect;
	$scope.list = list;

	function connect() {
		$resource('/connect/:incubator').get({incubator: $scope.incubator}, callback);
		function callback(response) {
			console.log(response.host)
			if(response.host)
				$scope.host = response.host;
		}
	}

	function list() {
		$resource('/dev/list').get({}, callback);
		function callback(response) {
			console.log(response);
		}

	}
}

function config($compileProvider) {
	this.$inject = ["$compileProvider"];
	$compileProvider.aHrefSanitizationWhitelist(/:3000/);
}