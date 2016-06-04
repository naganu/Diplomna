(function() {
    'use strict';

    function controller($resource, $interval, $scope) {
        var tuning = this;
        tuning.targetTemp = 0;
        tuning.measeredTemp = 0;
        tuning.correction = 0;
        tuning.period = 0;
        tuning.p = 0;
        tuning.d = 0;
        tuning.i = 0;
        tuning.r_p = 0;
        tuning.r_i = 0;
        tuning.r_d = 0;

        tuning.update = function() {
            $resource('/incubator/tuning').save({}, {
                temp: {
                    p: tuning.p,
                    d: tuning.d,
                    i: tuning.i,
                    target: tuning.targetTemp,
                    period: tuning.period
                }
            }, function (response) {

            })
        };

        function get() {
            $resource('/incubator/tuning').get({}, {}, function(response) {
                if(response.temp) {
                    tuning.measeredTemp = response.temp.data;
                    tuning.correction = response.temp.correction;
                    tuning.r_p = response.temp.p;
                    tuning.r_i = response.temp.i;
                    tuning.r_d = response.temp.d;
                }
                console.log(response);
            });
        }

        get();
        var interval = $interval(get, 10000);
        $scope.$on('$destroy', function() {
            $interval.cancel(interval);
        });
    }

    controller.$inject = ['$resource', '$interval', '$scope'];

    angular.module('incubator').controller('tuningController', controller);
})()
