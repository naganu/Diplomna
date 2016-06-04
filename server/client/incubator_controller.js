(function () {
	'use strict';

    function controller($resource, $interval, $scope) {
        var incubator = this;

        incubator.buttons = [
            {
                message: 'Internal ventilator',
                url: '/int_vent'
            },
            {
                message: 'External ventilator',
                url: '/ext_vent'
            },
            {
                message: 'Heater',
                url: '/heater'
            },
            {
                message: 'Led light',
                url: '/led_light'
            },
            {
                message: 'Motor - rotation',
                url: '/mot_rot'
            },
            {
                message: 'Peristaltic pump',
                url: '/per_pump'
            },
            {
                message: 'Buzzer',
                url: '/buzzer'
            }
        ];

        incubator.hall = {
            message: 'Hall sensor',
            url: '/incubator/hall',
            value: false
        }

        var interval = $interval(function() {
            $resource(incubator.hall.url).save({}, {}, function (response) {
                incubator.hall.value = response.state;
            });
        }, 5000);

		$scope.$on("$destroy", function() {
			$interval.cancel(interval);
		});
    }

    controller.$inject = ['$resource', '$interval', '$scope'];

    angular.module('incubator').controller('incubatorController', controller);
})()
