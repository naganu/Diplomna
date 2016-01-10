(function () {
	'use strict';
	angular.module('incubator')
	.controller('navigationController', controller);

	function controller($scope) {
		var navigate = this;
		navigate.$inject = ['$scope'];
		navigate.paths = ['/test', '/settings'];

		$scope.$on('$routeChangeSuccess', function(event, current, previus) {
			if(current)
				navigate.button = navigate.paths.indexOf(current.$$route.originalPath) + 1
			else
				navigate.button = 0;
		});
	}
})()