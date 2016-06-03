var read = require('./bind_and_read');
var PIDController = require('./pid_controller');

module.exports = new PIDController(0.3, 0.3, 0.3, 3, function() {
    return new Promise(function(resolve, reject) {
        read().then(function(data) {
            resolve(data.temp);
        });
    })
});
