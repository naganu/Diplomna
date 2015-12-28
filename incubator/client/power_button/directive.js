(function () {
	'use strict';
	
	angular.module('incubator')
		.directive('powerButton', power_button);

	function power_button() {
		return {
			templateUrl: "/power_button/template.html",
			scope: true,
			controller: "powerButtonController",
			controllerAs: "buttonOnOff",
			bindToController: {
				url: "@"
			}
		}	
	}
})()
