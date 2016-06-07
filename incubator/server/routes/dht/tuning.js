var {Router} = require('express');
var fs = require('fs');
var wpi = require('wiring-pi');
var awaitController = require('./await_controller');
var read = require('./bind_and_read');
var PIDController = require('./pid_controller');
var ventController = require('./vent_controller');
var humiController = require('./humi_controller');
var measurement = require('./model')
var temp = new PIDController(3, function() {
    return new Promise(function(resolve, reject) {
        read().then(function(data) {
            resolve(data.temp);
        });
    })
});
var humi = new humiController(22,  function() {
    return new Promise(function(resolve, reject) {
        read().then(function(data) {
            resolve(data.humi);
        });
    })
});
var intVent = new ventController(50, 1);
var rotation = new awaitController(23, 21, 3);
var router = new Router();
var setted= null;
var buzzer = 28;
var extVent = new ventController(80, 2);
var runTimeout = null;
var stopTimeout = null;
var beep = true;

router.route('/tuning')
.get(function(request, response, next) {
    if(setted) {
        var tempData = {
            temp: {
                data: temp.data,
                correction: temp.correction,
                p: temp.p,
                i: temp.i,
                d: temp.d
            },
            humi: {
                data: humi.data
            },
            setted: setted
        };
        measurement.create(tempData).then(function(doc) {
            response.send(tempData);
        }, next);
    } else {
        response.send({});
    }
})
.post(function(request, response, next) {
    var setTemp = request.body.temp;
    if(!setTemp.target) {
        if(runTimeout) {
            clearTimeout(runTimeout);
            runTimeout = null;
        }
        if(stopTimeout) {
            clearTimeout(stopTimeout);
            stopTimeout = null;
        }
        intVent.stop();
        temp.stop();
        humi.stop();
        rotation.stop();
        extVent.stop();
    } else if(Object.keys(setTemp).length === 5) {
        setted = Object.assign({}, request.body);
        intVent.run();
        rotation.run(setted.rotation);
        humi.run(setted.humi.target, setTemp.period, 15, 35);
        temp.run(setTemp.p, setTemp.i, setTemp.d, setTemp.target, setTemp.period, function() {
            if(beep && !wpi.softPwmCreate(buzzer, 50, 100)) {
                beep = false;
                setTimeout(function() {
                    wpi.softPwmStop(buzzer);
                }, 1000);
                setTimeout(function() {
                    beep = true;
                }, 3 * 60 * 1000);
            }
            runTimeout = setTimeout(function() {
                extVent.run();
                stopTimeout = setTimeout(function() {
                    extVent.stop();
                    stopTimeout = null;
                }, 60 * 1000);
            }, 60 * 1000);
        });
    }
    response.send({set: true});
});

router.get('/tuning/data', function(request, response, next) {
    measurement.find({}).sort({time: 'desc'}).limit(20).exec().then(function(docs) {
        response.send({data: docs});
    }, next);
});

module.exports = router;
