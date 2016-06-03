var wpi = require('wiring-pi');
var PIDController = require('node-pid-controller');
var range = 100;

module.exports = function(p, i, d, pin, sensor) {
    this.p = p;
    this.i = i;
    this.d = d;
    this.pin = pin;
    this.sensor = sensor;
    this.target = 0;
    this.period = 0;
    this.interval = null;

    this.setTarget = function(target) {
        this.target = target;
    }

    this.start = function(period) {
        this.stop();
        if(!wpi.softPwmCreate(pin, 0, range)) {
            this.pid = new PIDController({
                k_p: p,
                k_i: i,
                k_d: d,
                dt: period,
                i_max: range
            });
            this.interval = setInterval(function() {
                this.sensor().then(function(data) {
                    console.log(data);
                    var correction = this.pid.update(data);
                    console.log(correction);
                    wpi.softPwmWrite(this.pin, correction);
                });
            }, 1000 * period);
        }
    }

    this.stop = function() {
        if(this.interval) {
            wpi.softPwmStop(this.pin);
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    this.restart = function(target, period) {
        this.setTarget(target);
        this.start(period);
    }
}
