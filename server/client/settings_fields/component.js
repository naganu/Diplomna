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
			$ctrl.empty = [];
			$ctrl.update = update;
			$ctrl.add = add;
			$ctrl.remove = remove;
			$ctrl.add();

			function reflect() {
				$ctrl.onUpdate({
					setting: $ctrl.name,
					settingsList: $ctrl.settings,
					empty: $ctrl.empty
				});
			}

			function update(i, field, value, fields) {
				$ctrl.settings[i][field] = value;
				$ctrl.empty[i] = Object.keys($ctrl.settings[i]).length == fields;
				reflect();
			}

			function add() {
				$ctrl.settings.push({});
				$ctrl.empty.push(false);
				reflect();
			}

			function remove(i) {
				$ctrl.settings.splice(i, 1);
				$ctrl.empty.splice(i, 1);
				reflect();
			}
		}
    });
})()
