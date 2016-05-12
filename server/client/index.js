(function () {
	'use strict';

    var module = 'incubator';

	function config($mdThemingProvider, $routeProvider, $translateProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('blue')
			.warnPalette('red');
		$mdThemingProvider.theme('on_off')
	    	.primaryPalette('green')
			.warnPalette('red');

	    $routeProvider
	    .when('/test', {
	    	templateUrl: 'pages/test.html',
	    	controller: 'incubatorController',
	    	controllerAs: 'incubator'
	    }).when('/settings', {
	    	templateUrl: 'pages/settings.html',
	    	controller: 'settingsController',
	    	controllerAs: 'settings'
	    }).when('/home', {
	    	templateUrl: 'pages/dht.html',
	    	controller: 'dhtController',
	    	controllerAs: 'dht'
	    }).otherwise('/home');

		$translateProvider.translations("en", {
			"incubator-connect": "Incubator",
			"bulgarian": "Български",
			"language": "language",
			"english": "English",
			"connect": "CONNECT",
			"home": "HOME",
			"test": "TEST",
			"settings": "SETTINGS",
			"program": "Program",
			"start": "START",
			"current temperature": "Current temperature",
			"current humidity": "Current humidity",
			"stop": "STOP",
			"resume": "RESUME",
			"end": "END",
			"new": "NEW",
			"update": "UPDATE",
			"remove": "REMOVE",
			"program name": "Program name",
			"save": "SAVE",
			"add": "ADD",
			"Internal ventilator": "Internal ventilator"
		});

    	$translateProvider.translations("bg", {
			"incubator-connect": "Инкубатор",
			"bulgarian": "Български",
			"language": "език",
			"english": "English",
			"connect": "СВЪРЗВАНЕ",
			"home": "НАЧАЛО",
			"test": "ИЗПРОБВАЙ",
			"settings": "НАСТРОЙКИ",
			"program": "Програма",
			"start": "СТАРТ",
			"current temperature": "Температура",
			"current humidity": "Влажност",
			"stop": "СПРИ",
			"resume": "ВЪЗСТАНОВИ",
			"end": "КРАЙ",
			"new": "НОВА",
			"update": "ПРОМЕНИ",
			"remove": "ПРЕМАХНИ",
			"program name": "Програма",
			"save": "ЗАПАЗИ",
			"add": "ДОБАВИ",
			"Internal ventilator": "Вентилатор за охлаждане"

		});

		$translateProvider.use("en");
		$translateProvider.useSanitizeValueStrategy("escape");
	}

	config.$inject = ['$mdThemingProvider', '$routeProvider', '$translateProvider'];

    angular.module(module, ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngResource', 'ngRoute', 'pascalprecht.translate']).config(config);

	angular.element(document).ready(function() {
		angular.bootstrap(document, [module]);
	});
})()
