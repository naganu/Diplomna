var read_sensor = require("./bind_&_read");
var express = require('express');
var router = express.Router();

router.get("/sensor", function(request, response, next) {
	read_sensor().then(response.send, next);
});

module.exports = router;