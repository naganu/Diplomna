var express = require('express');
var router = express.Router();
var led = require('./led');

router.use(led);

module.exports = router;