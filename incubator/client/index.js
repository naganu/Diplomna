angular.module('incubator', ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngResource'])
	.controller('incubatorController', controller);

function controller($resource) {
	var incubator = this;
	incubator.$inject = ['$resource'];
	incubator.led = led;

	function led() {
		$resource('/led').save({}, {}, callback);
		function callback(response) {};
	}
}
