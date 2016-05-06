(function () {
	'use strict';

	function controller() {
		var settings = this;
        settings.program = {};
        settings.saveProgram = saveProgram;
        settings.update = update;

        function saveProgram() {
            console.log(settings.program);
        }

        function update(setting, settingsList) {
            settings.program[setting] = settingsList;
        }
	}

    controller.$inject = [];

    angular.module('incubator').controller('settingsController', controller);

})();
