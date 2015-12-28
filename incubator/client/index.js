angular.module('incubator', ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngResource'])
	.controller('incubatorController', controller);
	.config(config);

function controller($resource) {
	var incubator = this;
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
}

function config($mdThemingProvider) {
	this.$inject = ['$mdThemingProvider'];
	$mdThemingProvider.theme('default')
    .primaryPalette('green')
}
