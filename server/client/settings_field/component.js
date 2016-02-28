(function () {
	'use strict';
	
	angular.module('incubator').component('settingsField', {
        templateUrl: "/settings_field/template.html",
        bindings: {
            name: "@",
            settings: "<"
        }
    });
})()
