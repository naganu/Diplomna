var read_sensor = require("./dht/bind_and_read");
var express = require('express');
var router = express.Router();

router.get("/sensor", function(request, response, next) {
	read_sensor().then(function send(data) {
		console.log(data);
		response.send(data);
	}, next);
});

module.exports = router;
