var wpi = require('wiring-pi');
var temp = require('./temp');
var extVent = require('./ext_vent');

wpi.wiringPiSetup();
temp.run(38.9, 10);
extVent.run();
