var wpi = require('wiring-pi');
var temp = require('./temp');
var intVent = require('./int_vent');
var rotatation = require('./rotatation')
var t = 23.5;
var timeout = null;
wpi.wiringPiSetup();
intVent.run();

var interval = setInterval(function() {
    t += 5;
    temp.run(t, 10, function() {
        timeout = setTimeout(rotatation.run, 5000);
    });
}, 60000);

setTimeout(function() {
    clearInterval(interval);
    clearTimeout(timeout);
    intVent.stop();
    temp.stop();
    rotatation.stop();
}, 200000);
