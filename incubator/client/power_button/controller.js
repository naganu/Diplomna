(function () {
	'use strict';
	
	angular.module('incubator')
		.controller('powerButtonController', controller);

	function controller($resource) {
		var buttonOnOff = this;
		buttonOnOff.$inject = ['$resource'];
		buttonOnOff.value = false;
		buttonOnOff.press = press;

		function press() {
			buttonOnOff.value = !buttonOnOff.value;
			$resource(buttonOnOff.url).save({}, {state: buttonOnOff.value}, callback);
			function callback(response) {};
		}
	}
})()