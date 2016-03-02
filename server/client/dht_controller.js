(function () {
	'use strict';

	function controller($resource, $interval) {
		var dht = this;
		dht.sensor = {temp: 0.0, humi: 0.0};
		dht.programOptions = ["p1", "p2", "p3"];
		dht.programStoped = false;
        dht.program = {};

		dht.startProgram = function() {

		};

		dht.stopProgram = function() {
			dht.programStoped = false;
		};

		dht.resumeProgram = function() {
			dht.programStoped = true;
		};

		$interval(function() {
			$resource('/incubator/sensor').get({}, {}, function (response) {
				dht.sensor.temp = response.temp;
				dht.sensor.humi = response.humi;
			})
		}, 2000);
	}
    
    controller.$inject = ['$resource', '$interval'];
    
    angular.module('incubator').controller('dhtController', controller);
})()
