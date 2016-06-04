var express = require('express');
var router = express.Router();
var program = require('./program/router');
var testing = require('./testing');
var sensor = require('./sensor');
var tuning = require('./dht/tuning');

router.use(testing);
router.use(sensor);
router.use(program);
router.use(tuning);

module.exports = router;
