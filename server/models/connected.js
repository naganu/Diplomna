var mongoose = require('mongoose');

module.exports = mongoose.model('Connected', {incubator: String, host: String});