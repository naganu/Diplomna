(function () {
	'use strict';

	function controller($mdDialog) {
		var settings = this;
		settings.all = ['incubation', 'hatching'];
        settings.program = {};
        settings.saveProgram = saveProgram;
        settings.update = update;
		settings.empty = {};
		for(var i = 0; i < settings.all.length; ++i) {
			settings.program[settings.all[i]] = [{}];
		}
		settings.program[settings.all[0]][0] = {
			period: 2,
			interval: 3
		};

		function isEmpty() {
			function all_true(arr) {
				return arr.every(function(e) {return e;});
			}
			var test = [];
			for(var i = 0; i < settings.all.length; ++i) {
				test[i] = all_true(settings.empty[settings.all[i]]);
			}
			return  !(all_true(test) && settings.program.name);
		}

        function saveProgram() {
			if(isEmpty()) {
				$mdDialog.show(
					$mdDialog.alert()
						.textContent("All fields are required!")
						.ok("Okay")
						.theme("on_off")
				);
			} else {
				console.log(settings.program);
			}
        }

        function update(setting, settingsList, empty) {
            settings.program[setting] = settingsList;
			settings.empty[setting] = empty;
        }
	}

    controller.$inject = ["$mdDialog"];

    angular.module('incubator').controller('settingsController', controller);

})();
