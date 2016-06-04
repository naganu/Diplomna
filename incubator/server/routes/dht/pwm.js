var wpi = require('wiring-pi');
var pin = 3;
console.log(wpi.softPwmCreate(pin, 0, 100));
wpi.softPwmWrite(pin, 50);
