var mongoose = require('mongoose');

module.exports = mongoose.model('Incubator', {user: String, host: String});