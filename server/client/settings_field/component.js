(function () {
	'use strict';

	angular.module('incubator').component('settingsField', {
        templateUrl: "/settings_field/template.html",
        bindings: {
            onUpdate: "&",
			onRemove: "&",
			removeBtn: "<",
			rotateField: "<",
			settings: "<"
        },
		controller: function() {
			var $ctrl = this;
			$ctrl.all = ['period', 'interval', 'temperature', 'humidity'];
		}
    });
})()
