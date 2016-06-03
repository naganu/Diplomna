var read = require('./bind_and_read');
var wpi = require('wiring-pi');
var PIDController = require('node-pid-controller');
var period = 10;
var range = 100;
var pin = 3;
var pid = new PIDController({
    k_p: 0.01,
    k_i: 0.01,
    k_d: 0.01,
    dt: period,
    i_max: range
});
var target = 37.6;
var correction = 0;
var return_val = wpi.softPwmCreate(pin, 0, range);
if(return_val) {
    console.log(return_val);
    procces.exit(return_val);
}
pid.setTarget(target);
var tick = setInterval(function() {
    read().then(function(data) {
        console.log(data);
        correction = pid.update(data.temp);
        console.log(correction);
        wpi.softPwmWrite(pin, correction);
    });
}, period * 1000);
