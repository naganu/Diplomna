var wpi = require('wiring-pi');

module.exports = function(speed, period, pin) {
    this.interval = null;

    this.run = function() {
        this.stop();
        if(!wpi.softPwmCreate(pin, 0, 100)) {
            var state = false;
            if(!perriod) {
                wpi.softPwmWrite(pin, speed);
                this.interval = true;
            } else {
                this.interval = setInterval(function() {
                    state = !state;
                    wpi.softPwmWrite(pin, state ? speed : 0);
                }, 60000 * period);
            }
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
