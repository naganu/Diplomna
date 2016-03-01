(function () {
	'use strict';

	function controller($resource) {
		var buttonOnOff = this;
		buttonOnOff.value = false;
		buttonOnOff.press = press;

		function press() {
			buttonOnOff.value = !buttonOnOff.value;
			$resource(buttonOnOff.url).save({}, {state: buttonOnOff.value}, callback);
			function callback(response) {
				//buttonOnOff.value = response.value;
			};
		}
	}
    
    controller.$inject = ['$resource'];
    
    angular.module('incubator').controller('powerButtonController', controller);
})()