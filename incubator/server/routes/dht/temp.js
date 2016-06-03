var read = require('./bind_and_read');
var PIDController = require('./pid_controller');
var wpi = require('wiring-pi');
wpi.wiringPiSetup();
var pid = new PIDController(0.3, 0.3, 0.3, 3, function() {
    return new Promise(resolve, reject) {
        read().then(data) {
            resolve(data.temp);
        }
    }
});
pid.restart(28.9, 10);
