(function () {
	'use strict';

	function controller($scope) {
		var navigate = this;
		navigate.paths = ['/test', '/settings'];
		navigate.sensor = {temp: "temp", humi: "humi"};

		$scope.$on('$routeChangeSuccess', function(event, current, previus) {
			if((current !== undefined) && (current.$$route !== undefined))
				navigate.button = navigate.paths.indexOf(current.$$route.originalPath) + 1
			else
				navigate.button = 0;
		});
	}
    
    controller.$inject = ['$scope']
    
    angular.module('incubator').controller('navigationController', controller);
   
})()