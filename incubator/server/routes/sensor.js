var read_sensor = require("./dht/bind_&_read");
var express = require('express');
var router = express.Router();

router.get("/sensor", function(request, response, next) {
	function send(data) {
		response.send(data);
	}
	read_sensor().then(send, next);
});

module.exports = router;
