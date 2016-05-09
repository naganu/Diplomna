(function () {
	'use strict';

	function controller($resource, $mdDialog) {
		var settings = this;
		settings.all = ['incubation', 'hatching'];
		settings.changeState =  changeState;
		settings.doWithProgram = doWithProgram;
		settings.update = update;
		settings.empty = {};
		onInit();

		function onInit() {
			changeState('new');
			$resource('/incubator/program').get({}, {}, function (response) {
				settings.programs = response.programs;
			});
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
			settings.state = 'edit';
		}

		function removeProgram() {
			var name = settings.programs[settings.choosen].name;
			$resource('/incubator/program/:name').remove({name: name}, {}, function (response) {
				settings.programs.splice(settings.choosen, 1);
				changeState("new");
			});
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
						saveProgram();
						break;
					case "edit":
						editProgram();
						break;
				}
			}
		}

		function saveProgram() {
			$resource('/incubator/program').save({}, {program: settings.program}, function (response) {
				var message;
				if(response.success) {
					settings.programs.push(settings.program);
					message = "Program saved!";
				} else {
					message = "Error while saving! (probably a progaram with the same name already exists in your collection)";
				}
				$mdDialog.show(
					$mdDialog.alert()
						.textContent(message)
						.ok("Okay")
						.theme("on_off")
				);
			});
		}

		function editProgram() {
			var id = settings.programs[settings.choosen]._id;
			$resource('/incubator/program/:id').save({id: id}, {program: settings.program}, function (response) {
				$mdDialog.show(
					$mdDialog.alert()
						.textContent(response.success ? "program updated!" : "Error while updating! (probably a progaram with the same name already exists in your collection)")
						.ok("Okay")
						.theme("on_off")
				);
			});
		}

		function update(setting, settingsList, empty) {
			settings.program[setting] = settingsList;
			settings.empty[setting] = empty;
		}
	}

    controller.$inject = ["$resource", "$mdDialog"];

    angular.module('incubator').controller('settingsController', controller);

})();
