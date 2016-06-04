(function() {
    'use strict';

    function controller() {
        var tuning = this;
        tuning.targetTemp = 38.6;
        tuning.measeredTemp = 35;
        tuning.correction = 4;
        tuning.T_period = 10;
        tuning.p = 0.3;
        tuning.d = 0.3;
        tuning.i = 0.4;
    }

    controller.$inject = [];

    angular.module('incubator').controller('tuningController', controller);
})()
