angular.module('incubator', ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngResource'])
	.controller('incubatorController', controller);
	.config(config);

function controller($resource) {
	var incubator = this;
	incubator.$inject = ['$resource'];
	incubator.value = false;
	incubator.led = led;

	function led() {
		incubator.value = !incubator.value;
		$resource('/led').save({}, {}, callback);
		function callback(response) {};
	}
}

function config($mdThemingProvider) {
	this.$inject = ['$mdThemingProvider'];
	$mdThemingProvider.theme('default')
    .primaryPalette('green')
}
