var wpi = require('wiring-pi');
var PIDController = require('node-pid-controller');
var range = 100;

module.exports = function(p, i, d, pin, sensor) {
    this.interval = null;

    this.run = function(target, period, onTarget) {
        this.stop();
        if(!wpi.softPwmCreate(pin, 0, range)) {
            var pid = new PIDController({
                k_p: p,
                k_i: i,
                k_d: d,
                dt: period,
                i_max: range
            });
            pid.setTarget(target);
            this.interval = setInterval(function() {
                sensor().then(function(data) {
                    var correction = pid.update(data);
                    if(correction > 1) {
                        wpi.softPwmWrite(pin, correction);
                    } else {
                        if(typeof onTarget === 'function') {
                            onTarget();
                        }
                        wpi.softPwmWrite(pin, 0);
                    }
                });
            }, 1000 * period);
        }
    }

    this.stop = function() {
        if(this.interval) {
            wpi.softPwmStop(pin);
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}
