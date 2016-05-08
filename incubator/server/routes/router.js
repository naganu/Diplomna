var express = require('express');
var router = express.Router();
var program = require('./program/router');
/*var testing = require('./testing');
var sensor = require('./sensor');

router.use(testing);
router.use(sensor);
*/
router.use(program);

module.exports = router;
