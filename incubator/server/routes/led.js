var express = require('express');
var router = express.Router();
var wpi = require('wiring-pi');
var pin = 1;

wpi.wiringPiSetup();
wpi.pinMode(pin, wpi.OUTPUT);

router.post("/led", led);

function led(request, response) {
	wpi.digitalWrite(pin, request.body.value);
	response.send({});
}

module.exports = router;