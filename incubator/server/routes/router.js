var express = require('express');
var router = express.Router();
var testing = require('./testing');

router.use(testing);

module.exports = router;
