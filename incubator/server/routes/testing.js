var express = require('express');
var router = express.Router();
var wpi = require('wiring-pi');
var pin = 1;
var state = 0;

wpi.wiringPiSetup();
wpi.pinMode(pin, wpi.OUTPUT);

router.post("/ext_vent", led);

function ext_vent(request, response) {
	if(request.body.state)
		wpi.digitalWrite(pin, wpi.HIGH);
	else
		wpi.digitalWrite(pin, wpi.LOW);
	response.send({});
}

module.exports = router;
