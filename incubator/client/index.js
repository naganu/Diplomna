(function () {
	'use strict';

	angular.module('incubator', ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngResource', 'ngRoute'])
	.config(config);

	function config($mdThemingProvider, $routeProvider) {
		//this.$inject = ['$mdThemingProvider', '$routeProvider'];
		$mdThemingProvider.theme('default')
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
	    });
	}

	config.$inject = ['$mdThemingProvider', '$routeProvider'];

	angular.element(document)
	.ready(function() {
		angular.bootstrap(document, ['incubator']);
	});
})()