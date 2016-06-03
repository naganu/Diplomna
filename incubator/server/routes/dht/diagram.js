var wpi = require('wiring-pi');
var read = require('./bind_and_read');
wpi.wiringPiSetup();
wpi.softPwmWrite(1, 50);
wpi.softPwmWrite(3, 70);
setInterval(function() {
    read().then(function(data) {
        console.log(data.temp);
    });
}, 10000);
setTimeout(process.exit, 3600000);
