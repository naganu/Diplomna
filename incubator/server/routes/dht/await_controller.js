var wpi = require('wiring-pi');

module.exports = function(sensor, action, delay) {
    this.timeout = null;
    this.wait = false;

    this.run = function() {
        wpi.pinMode(sensor, wpi.INPUT);
        wpi.pinMode(action, wpi.OUTPUT);
        wpi.pullUpDnControl(sensor, wpi.PUD_UP);
        wpi.digitalWrite(action, wpi.HIGH);
        if(delay > 0) {
            this.timeout = setTimeout(this.awaiting, delay);
        } else {
            this.awaiting();
        }
    };

    this.awaiting = function() {
        this.wait = true;
        wpi.wiringPiISR(sensor, wpi.INT_EDGE_BOTH, function(delta) {
            wpi.digitalWrite(action, wpi.LOW);
            this.wait = false;
            wpi.wiringPiISRCancel(sensor);
        });
    };

    this.stop = function() {
        if(this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if(this.wait) {
            wpi.wiringPiISRCancel(sensor);
            this.wait = false;
        }
    };
};
