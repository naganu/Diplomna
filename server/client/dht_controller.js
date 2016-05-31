(function () {
	'use strict';

	function controller($resource, $interval) {
		var dht = this;
		dht.sensor = {temp: 0.0, humi: 0.0};
		dht.programOptions = [];
		dht.programStoped = false;
        dht.program = {};

		$resource('/incubator/program').get({}, {}, function (response) {
			dht.programOptions = response.programs;
		});

		dht.stopProgram = function() {
			dht.programStoped = false;
		};

		dht.resumeProgram = function() {
			dht.programStoped = true;
		};

		function get_dht() {
			$resource('/incubator/sensor').get({}, {}, function (response) {
				dht.sensor.temp = response.temp;
				dht.sensor.humi = response.humi;
			})
		}

		get_dht()
		$interval(get_dht, 5000);
	}

    controller.$inject = ['$resource', '$interval'];

    angular.module('incubator').controller('dhtController', controller);
})()
