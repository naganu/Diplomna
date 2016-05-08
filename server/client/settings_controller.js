(function () {
	'use strict';

	function controller($mdDialog) {
		var settings = this;
		settings.all = ['incubation', 'hatching'];
		settings.changeState =  changeState;
		settings.doWithProgram = doWithProgram;
        settings.update = update;
		settings.empty = {};
		onInit();

		function onInit() {
			changeState('new');
			settings.programs = [{
				name: "test",
				hatching: [{
					period: 2,
					temperature: 3
				}],
				incubation: [{
					period: 2,
					interval: 3
				}]
			}];
		}

		function changeState(state) {
			settings.state = state;
			settings.choosen = -1;
			if(state === 'new') {
				newProgram();
			}
		}

		function doWithProgram() {
			switch(settings.state) {
				case "update":
					updateProgram();
					break;
				case "remove":
					removeProgram();
					break;
				default: incubatorAction();
			}
		}

		function newProgram() {
			delete settings.program;
			settings.program = {};
			for(var i = 0; i < settings.all.length; ++i) {
				settings.program[settings.all[i]] = [{}];
			}
		}

		function updateProgram() {
			settings.program = settings.programs[settings.choosen];
			for(var i = 0; i < settings.all.length; ++i) {
				settings.empty[settings.all[i]] = [true];
			}
			changeState('edit');
		}

		function removeProgram() {
			settings.programs.splice(settings.choosen, 1);
			changeState("new");

		}

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

        function incubatorAction() {
			if(isEmpty()) {
				$mdDialog.show(
					$mdDialog.alert()
						.textContent("All fields are required!")
						.ok("Okay")
						.theme("on_off")
				);
			} else {
				switch(settings.state) {
					case "new":
						newProgram();
						break;
					case "edit":
						editProgram();
						break;
				}
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
