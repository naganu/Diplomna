var wpi = require('wiring-pi');

module.exports = function(speed, pin) {
    this.running = false;

    this.run = function() {
        this.stop();
        if(!wpi.softPwmCreate(pin, 0, 100)) {
            wpi.softPwmWrite(pin, speed);
            this.running = true;
        }
    }

    this.stop = function() {
        if(this.running) {
            wpi.softPwmStop(pin);
            this.running = false;
        }
    }
}
