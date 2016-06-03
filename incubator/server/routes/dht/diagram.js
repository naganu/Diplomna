var wpi = require('wiring-pi');
var read = require('./bind_and_read');
var vent = 1;
var temp = 3;
wpi.wiringPiSetup();
wpi.softPwmCreate(vent, 0, 100);
wpi.softPwmCreate(temp, 0, 100);
wpi.softPwmWrite(vent, 50);
wpi.softPwmWrite(temp, 70);
setInterval(function() {
    read().then(function(data) {
        console.log(data.temp);
    });
}, 10000);
setTimeout(process.exit, 3600000);
