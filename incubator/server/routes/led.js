var express = require('express');
var router = express.Router();
var wpi = require('wiring-pi');
var pin = 1;
var state = 0;

wpi.wiringPiSetup();
wpi.pinMode(pin, wpi.OUTPUT);

router.post("/led", led);

function led(request, response) {
	state = !state;
	if(state)
		wpi.digitalWrite(pin, wpi.HIGH);
	else
		wpi.digitalWrite(pin, wpi.LOW);
	response.send({});
}

module.exports = router;
