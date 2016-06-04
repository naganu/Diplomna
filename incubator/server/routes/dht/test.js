var wpi = require('wiring-pi');
var temp = require('./temp');
var intVent = require('./int_vent');
var rotation = require('./rotation')
var t = 23.5;
var timeout = null;
wpi.wiringPiSetup();
intVent.run();
intVent.stop();

var interval = setInterval(function() {
    rotation.run();
    t += 5;
    temp.run(t, 10, function() {
        timeout = setTimeout(rotation.run, 5000);
    });
}, 60000);

setTimeout(function() {
    console.log("STOP");
    clearInterval(interval);
    clearTimeout(timeout);
    intVent.stop();
    temp.stop();
    rotation.stop();
}, 200000);

rotation.run()
