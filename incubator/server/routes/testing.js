var express = require('express');
var router = express.Router();
var wpi = require('wiring-pi');

wpi.wiringPiSetup();

var tests = [
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

for(var t in tests) {
	wpi.pinMode(t.pin, wpi.OUTPUT);
	router.post(t.url, t.pin);
}


function test(pin) {
	return function (request, response) {
		if(request.body.state)
			wpi.digitalWrite(pin, wpi.HIGH);
		else
			wpi.digitalWrite(pin, wpi.LOW);
		response.send({});
	}
}

module.exports = router;
