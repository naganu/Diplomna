(function () {
	'use strict';
    
    var module = 'incubator';

	angular.module(module, ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngResource', 'ngRoute'])
	.config(config);

	function config($mdThemingProvider, $routeProvider) {
		//this.$inject = ['$mdThemingProvider', '$routeProvider'];
		$mdThemingProvider.theme('default')
	    .primaryPalette('blue');
		$mdThemingProvider.theme('on_off')
	    .primaryPalette('green');

	    $routeProvider
	    .when('/test', {
	    	templateUrl: 'pages/test.html',
	    	controller: 'incubatorController',
	    	controllerAs: 'incubator'
	    }).when('/settings', {
	    	templateUrl: 'pages/settings.html',
	    	controller: 'incubatorController',
	    	controllerAs: 'incubator'
	    }).when('/dht', {
	    	templateUrl: 'pages/dht.html',
	    	controller: 'dhtController',
	    	controllerAs: 'dht'
	    }).otherwise('/dht');
	}

	config.$inject = ['$mdThemingProvider', '$routeProvider'];

	angular.element(document).ready(function() {
		angular.bootstrap(document, [module]);
	});
})()