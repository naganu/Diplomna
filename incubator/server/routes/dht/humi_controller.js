var wpi = require('wiring-pi');

module.exports = function(pin, sensor) {
    var ctrl = this;
    ctrl.timeout = null;
    ctrl.interval = null;
    ctrl.data = 0;

    this.run = function(target, period, durutaion, value) {
        this.stop();
        function handler() {
            sensor().then(function(data) {
                ctrl.data = data;
                if((target - data > 5) && !wpi.softPwmCreate(pin, value, 100)) {
                    ctrl.timeout = setTimeout(function() {
                        wpi.softPwmStop(pin);
                    }, durutaion * 1000);
                }
            });
        }
        handler();
        if(period < 2 + durutaion) {
            period += durutaion + 3;
        }
        ctrl.interval = setInterval(handler, 1000 * period);
    };

    this.stop = function() {
        if(ctrl.interval) {
            clearInterval(ctrl.interval);
            ctrl.interval = null;
        }
        if(ctrl.timeout) {
            clearTimeout(ctrl.timeout);
            wpi.softPwmStop(pin);
            ctrl.timeout = null;
        }
    };
}
