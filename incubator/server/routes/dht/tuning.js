var temp = require('./temp');
var intVent = require('./int_vent');
var {Router} = require('express');
var router = new Router();

router.route('/tuning')
.get(function(request, response, next) {
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
    if(!intVen.interval) {
        intVent.run();
    }
    temp.run(setTemp.p, setTemp.i, setTemp.d, setTemp.target, setTemp.period);
    response.send({set: true});
});

module.exports = router;
