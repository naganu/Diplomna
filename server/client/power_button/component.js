(function () {
	'use strict';
	
	angular.module('incubator').component('powerButton', {
        templateUrl: "/power_button/template.html",
        controller: 'powerButtonController as buttonOnOff',
        bindings: {
            url: "@"
        }
    });
})()
