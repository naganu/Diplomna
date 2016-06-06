var express = require('express');
var router = express.Router();
var wpi = require('wiring-pi');
var state = {};

var outputs = [
	{
		pin: 1,
		url: '/int_vent'
	},
	{
		pin: 2,
		url: '/ext_vent'
	},
	{
		pin: 3,
		url: '/heater'
	},
	{
		pin: 4,
		url: '/led_light'
	},
	{
		pin: 21,
		url: '/mot_rot'
	},
	{
		pin: 22,
		url: '/per_pump'
	},
	{
		pin: 28,
		url: '/buzzer'
	}
];

var inputs = [
	{
		pin: 23,
		url: '/hall'
	}
];

function output(url, pin) {
	wpi.pinMode(pin, wpi.OUTPUT);
	return function (request, response) {
		state[url] = request.body.state;
		if(state[url]) {
			wpi.digitalWrite(pin, wpi.HIGH);
		} else {
			wpi.digitalWrite(pin, wpi.LOW);
		}
		response.send(request.body);
	};
}

function get_state(url) {
	return function(request, response) {
		response.send({state: state[url]});
	};
}

for(var i = 0;i < outputs.length; ++i) {
	var url = outputs[i].url;
	router.post(url, output(url, outputs[i].pin));
	router.get(url, get_state(url));
}

function input(pin) {
	wpi.pinMode(pin, wpi.INPUT);
	wpi.pullUpDnControl(pin, wpi.PUD_UP);
	return function(request, response) {
		response.send({state: wpi.digitalRead(pin)});
	}
}

for(var i = 0;i < inputs.length; ++i)
	router.post(inputs[i].url, input(inputs[i].pin));

module.exports = router;
