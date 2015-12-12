angular.module('index', ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngResource'])
	.controller('indexController', controller);

function controller($scope, $resource, $window) {
	$scope.$inject = ['$scope', '$resource', '$window'];
	$scope.connect = connect;

	function connect() {
		$resource('/connect/:incubator').get({incubator: $scope.incubator}, callback);
		function callback(response) {
			$window.location.href = response.host;
		}
	}
}
