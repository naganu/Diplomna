var wpi = require('wiring-pi');
var temp = require('./temp');
var intVent = require('./int_vent');

wpi.wiringPiSetup();
temp.run(38.9, 10);
intVent.run();
