var temp = require('./temp');
var intVent = require('./int_vent');
var {Router} = require('express');
var fs = require('fs');
var router = new Router();

var log = fs.createWriteStream ("/home/pi/data.log", {flags: "a"});

router.route('/tuning')
.get(function(request, response, next) {
    log.write(temp.data + ',' + temp.correction + ',' + temp.p + ',' + temp.i + ',' + temp.d + '\n');
    response.send({temp: {
        data: temp.data,
        correction: temp.correction,
        p: temp.p,
        i: temp.i,
        d: temp.d
    }});
})
.post(function(request, response, next) {
    var setTemp = request.body.temp;
    intVent.run();
    temp.run(setTemp.p, setTemp.i, setTemp.d, setTemp.target, setTemp.period);
    log.write(setTemp.target + ' ' + setTemp.period + ' ' + setTemp.p + ' ' + setTemp.i + ' ' + setTemp.d + '\n');
    response.send({set: true});
});

module.exports = router;
