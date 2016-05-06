(function () {
	'use strict';

	angular.module('incubator').component('settingsFields', {
        templateUrl: "/settings_fields/template.html",
        bindings: {
            name: "@",
            onUpdate: "&",
			rotateField: "<"
        },
		controller: function() {
			var $ctrl = this;
			$ctrl.settings = [];
			$ctrl.update = update;
			$ctrl.add = add;
			$ctrl.remove = remove;
			$ctrl.add();

			function reflect() {
				$ctrl.onUpdate({setting: $ctrl.name, settingsList: $ctrl.settings});
			}

			function update(i, field, value) {
				$ctrl.settings[i][field] = value;
				reflect();
			}

			function add() {
				$ctrl.settings.push({});
				reflect();
			}

			function remove(i) {
				$ctrl.settings.splice(i, 1);
				reflect();
			}
		}
    });
})()
