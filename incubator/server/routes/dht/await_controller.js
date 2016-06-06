var wpi = require('wiring-pi');

module.exports = function(sensor, action, delay) {
    var ctrl = this;
    ctrl.timeout = null;
    ctrl.interval = null;
    ctrl.wait = false;

    ctrl.run = function(mins) {
        ctrl.stop();
        ctrl.interval = setInterval(function() {
            wpi.pinMode(sensor, wpi.INPUT);
            wpi.pinMode(action, wpi.OUTPUT);
            wpi.pullUpDnControl(sensor, wpi.PUD_UP);
            wpi.digitalWrite(action, wpi.HIGH);
            ctrl.timeout = setTimeout(ctrl.awaiting, delay * 1000);
        }, mins * 60000);
    };

    ctrl.awaiting = function() {
        ctrl.wait = true;
        ctrl.timeout = null;
        wpi.wiringPiISR(sensor, wpi.INT_EDGE_BOTH, function(delta) {
            wpi.digitalWrite(action, wpi.LOW);
            ctrl.wait = false;
            wpi.wiringPiISRCancel(sensor);
        });
    };

    ctrl.stop = function() {
        if(ctrl.interval) {
            clearInterval(ctrl.interval);
            ctrl.interval = null;
        }
        if(ctrl.timeout) {
            clearTimeout(ctrl.timeout);
            ctrl.timeout = null;
        }
        if(ctrl.wait) {
            wpi.wiringPiISRCancel(sensor);
            ctrl.wait = false;
        }
    };
};
