(function () {
	'use strict';

    function controller($resource, $interval) {
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
            url: '/hall',
            value: false
        }

        $interval(function() {
            $resource(incubator.hall.url).save({}, {}, function (response) {
                incubator.hall.value = response.state;
            });
        }, 2000);
    }

    controller.$inject = ['$resource', '$interval'];

    angular.module('incubator').controller('incubatorController', controller);
})()
