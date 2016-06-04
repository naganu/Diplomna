var wpi = require('wiring-pi');
var PIDController = require('./pid');
var range = 100;

module.exports = function(pin, sensor) {
    var ctrl = this;
    ctrl.interval = null;
    ctrl.data = 0;
    ctrl.correction = 0;
    ctrl.p = 0;
    ctrl.i = 0;
    ctrl.d = 0;

    this.run = function(p, i, d, target, period, onTarget) {
        ctrl.stop();
        if(!wpi.softPwmCreate(pin, 0, range)) {
            var pid = new PIDController({
                k_p: p,
                k_i: i,
                k_d: d,
                dt: period,
                i_max: range
            });
            pid.setTarget(target);
            function handler() {
                sensor().then(function(data) {
                    ctrl.data = data;
                    ctrl.correction = pid.update(data);
                    ctrl.p = pid.p;
                    ctrl.i = pid.i;
                    ctrl.d = pid.d;
                    if(ctrl.correction > 1) {
                        wpi.softPwmWrite(pin, ctrl.correction);
                    } else {
                        if(typeof onTarget === 'function') {
                            onTarget();
                        }
                        wpi.softPwmWrite(pin, 0);
                    }
                });
            }
            handler();
            ctrl.interval = setInterval(handler, 1000 * period);
        }
    }

    this.stop = function() {
        if(ctrl.interval) {
            wpi.softPwmStop(pin);
            clearInterval(ctrl.interval);
            ctrl.interval = null;
        }
    }
}
