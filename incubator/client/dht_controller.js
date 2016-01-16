(function () {
	'use strict';
	angular.module('incubator')
	.controller('dhtController', controller);

	function controller($resource) {
		var home = this;
		home.$inject = ['$resource'];
		home.sensor = {temp: 0.0, humi: 0.0};

		setInterval(function() {
			$resource('/sensor').save({}, {}, function (response) {
				home.sensor.temp = response.temp;
				home.sensor.humi = response.humi;
			});
		}, 200);
	}
})()