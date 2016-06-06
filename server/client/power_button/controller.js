(function () {
	'use strict';

	function controller($resource) {
		var buttonOnOff = this;
		buttonOnOff.value = false;
		buttonOnOff.press = press;

		$resource(buttonOnOff.url).get({}, {}, function(response) {
			var state = response.state;
			if(state) {
				buttonOnOff.value = state;
			}
		});

		function press() {
			buttonOnOff.value = !buttonOnOff.value;
			$resource(buttonOnOff.url).save({}, {state: buttonOnOff.value});
		}
	}

    controller.$inject = ['$resource'];

    angular.module('incubator').controller('powerButtonController', controller);
})()
