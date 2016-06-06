var {Router} = require('express');
var fs = require('fs');
var wpi = require('wiring-pi');
var awaitController = require('./await_controller');
var read = require('./bind_and_read');
var PIDController = require('./pid_controller');
var ventController = require('./vent_controller');
var temp = new PIDController(3, function() {
    return new Promise(function(resolve, reject) {
        read().then(function(data) {
            resolve(data.temp);
        });
    })
});
var intVent = new ventController(50, 1);
var rotation = new awaitController(23, 21, 3);
var router = new Router();
var set = null;
var buzzer = 28;
var extVent = ventController(80, 2);
var stopTimeout = null

var log = fs.createWriteStream ("/home/pi/data.log", {flags: "a"});

router.route('/tuning')
.get(function(request, response, next) {
    log.write(temp.data + ',' + temp.correction + ',' + temp.p + ',' + temp.i + ',' + temp.d + '\n');
    response.send({temp: {
        data: temp.data,
        correction: temp.correction,
        p: temp.p,
        i: temp.i,
        d: temp.d,
        set: set
    }});
})
.post(function(request, response, next) {
    var setTemp = request.body.temp;
    if(setTemp.target) {
        set = Object.assign({}, setTemp);
        set.rotation = request.body.rotation;
        log.write(setTemp.target + ' ' + setTemp.period + ' ' + setTemp.p + ' ' + setTemp.i + ' ' + setTemp.d + ' ' + set.rotation + '\n');
        intVent.run();
        rotation.run(set.rotation);
        temp.run(setTemp.p, setTemp.i, setTemp.d, setTemp.target, setTemp.period, function() {
            wpi.pinMode(buzzer, wpi.OUTPUT);
            wpi.digitalWrite(buzzer, wpi.HIGH);
            setTimeout(function() {
                wpi.digitalWrite(buzzer, wpi.LOW);
                stopTimeout = setTimeout(function() {
                    extVent.run();
                    stopTimeout = setTimeout(function() {
                        extVent.stop();
                        stopTimeout = null;
                    }, 60000);
                }, 60000);
            }, 1000);
        });
    } else {
        intVent.stop();
        temp.stop();
        rotation.stop();
        extVent.stop();
        if(stopTimeout) {
            clearTimeout(stopTimeout);
            stopTimeout = null;
        }
    }
    response.send({set: true});
});

module.exports = router;
