angular.module('incubator', ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngResource'])
	.controller('incubatorController', controller)
	.config(config);

function controller($resource) {
	var incubator = this;
	incubator.$inject = ['$resource'];

	incubator.buttons = [
		{
			message: 'External ventilator',
			url: '/ext_vent' 
		},
		{
			message: 'Internall ventilator',
			url: '/int_vent' 
		},
		{
			message: 'Heater',
			url: '/heater' 
		},
		{
			message: 'Led light',
			url: '/led_light' 
		},
		{
			message: 'Motor - rotation',
			url: '/mot_rot' 
		},
		{
			message: 'Peristaltic pump',
			url: '/per_pump' 
		},
		{
			message: 'Buzzer',
			url: '/buzzer' 
		}
	];

	incubator.hall = {
		message: 'Hall sensor',
		url: '/hall',
		value: false 
	}

	setInterval(function() {
		$resource(incubator.hall.url).save({}, {}, function (response) {
			incubator.hall.value = response.state;
		});
	}, 200);
}

function config($mdThemingProvider) {
	this.$inject = ['$mdThemingProvider'];
	$mdThemingProvider.theme('default')
    .primaryPalette('green')
}

angular.element(document)
.ready(function() {
	angular.bootstrap(document, ['incubator']);
});