var express = require('express');
var router = express.Router();
var wpi = require('wiring-pi');

var outputs = [
	{
		pin: 1,
		url: '/ext_vent' 
	},
	{
		pin: 2,
		url: '/int_vent' 
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

wpi.wiringPiSetup();

for(var i = 0;i < outputs.length; ++i) 
	router.post(outputs[i].url, output(outputs[i].pin));

for(var i = 0;i < inputs.length; ++i)
	router.post(inputs[i].url, input(inputs[i].pin));

function input(pin) {
	wpi.pinMode(pin, wpi.INPUT);
	wpi.pullUpDnControl(pin, wpi.PUD_UP);
	return function(request, response) {
		response.send({state: wpi.digitalRead(pin)});
	}
}

function output(pin) {
	wpi.pinMode(pin, wpi.OUTPUT);
	return function (request, response) {
		if(request.body.state)
			wpi.digitalWrite(pin, wpi.HIGH);
		else
			wpi.digitalWrite(pin, wpi.LOW);
		response.send({state: request.body.state});
	}
}

module.exports = router;
