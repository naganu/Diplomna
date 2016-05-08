var mongoose = require('mongoose');

module.exports = mongoose.model('Program', {
    name: {
        type: String,
        unique: true,
        required: true
    },
    hatching: [{
        period: Number,
        temperature: Number,
        humidity: Number,
    }],
    incubation: [{
        period: Number,
        interval: Number,
        temperature: Number,
        humidity: Number,
    }]
});
