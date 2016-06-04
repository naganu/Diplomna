(function() {
    'use strict';

    function controller($resource, $interval, $scope) {
        var tuning = this;
        tuning.targetTemp = 38.6;
        tuning.measeredTemp = 35;
        tuning.correction = 4;
        tuning.period = 10;
        tuning.p = 0.3;
        tuning.d = 0.3;
        tuning.i = 0.4;

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
