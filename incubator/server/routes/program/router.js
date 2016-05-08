var express = require('express');
var model = require('./model');
var router = express.Router();

router.route("/program")
.get(function(request, response, next) {
    model.find({}).exec().then(function(programs) {
        response.send({programs: programs});
    }, next);
})
.post(function(request, response, next) {
    model.create(request.body.program).then(function(program) {
        response.send(program);
    }, next);
});

router.route("/program/:name")
.post(function(request, response, next) {

})
.delete(function(request, response, next) {
    model.remove(request.body).exec().then(function() {
        response.send({});
    }, next);
});

module.exports = router;
