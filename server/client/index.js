(function () {
	'use strict';

    var module = 'incubator';

	function config($mdThemingProvider, $routeProvider) {
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
	}

	config.$inject = ['$mdThemingProvider', '$routeProvider'];

    angular.module(module, ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngResource', 'ngRoute']).config(config);

	angular.element(document).ready(function() {
		angular.bootstrap(document, [module]);
	});
})()
