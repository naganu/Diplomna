var express = require('express');
var router = express.Router();
var testing = require('./testing');
var sensor = require('./dht_sensor_AM2320')

router.use(testing);
router.use(sensor);

module.exports = router;
