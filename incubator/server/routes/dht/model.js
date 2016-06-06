var mongoose = require('mongoose');

module.exports = mongoose.model('Measurement', {
    temp: {
        data: Number,
        correction: Number,
        p: Number,
        i: Number,
        d: Number,
        set: {
            rotation: Number,
            p: Number,
            i: Number,
            d: Number,
            target: Number,
            period: Number
        }
    },
    time: {
        type: Date,
        default: Date.now
    }
});
