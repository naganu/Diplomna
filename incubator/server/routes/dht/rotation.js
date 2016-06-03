var wpi = require('wiring-pi');
wpi.wiringPiSetup();
var motor = 21;
var hall = 23;
wpi.pinMode(hall, wpi.INPUT);
wpi.pinMode(motor, wpi.OUTPUT);
wpi.pullUpDnControl(hall, wpi.PUD_UP);
wpi.digitalWrite(motor, wpi.HIGH);
wpi.wiringPiISR(hall, wpi.INT_EDGE_FALLING, function(delta) {
    wpi.digitalWrite(motor, wpi.LOW);
    wpi.wiringPiISRCancel(hall);
});
