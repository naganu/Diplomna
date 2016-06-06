var mongoose = require('mongoose');

module.exports = mongoose.model('Measurement', {
    temp: {
        data: Number,
        correction: Number,
        p: Number,
        i: Number,
        d: Number
    },
    humi: {
        data: Number
    },
    set: {
        rotation: Number,
        temp: {
            p: Number,
            i: Number,
            d: Number,
            target: Number,
            period: Number
        },
        humi: {
            target: Number
        }
    }
    time: {
        type: Date,
        default: Date.now
    }
});
