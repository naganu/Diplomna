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
        response.send({success: true});
    }, next);
});

router.post("/program/:id", function(request, response, next) {
    model.findByIdAndUpdate({_id: request.params.id}, request.body.program)
        .exec().then(function(program) {
            response.send({success: true});
    }, next);
});

router.delete("/program/:name", function(request, response, next) {
    model.remove({name: request.params.name}).exec().then(function() {
        response.send({});
    }, next);
});

module.exports = router;
