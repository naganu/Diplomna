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
                var temp = response.temp;
                if(temp) {
                    tuning.measeredTemp = temp.data;
                    tuning.correction = temp.correction;
                    tuning.r_p = temp.p;
                    tuning.r_i = temp.i;
                    tuning.r_d = temp.d;
                    var set = temp.set;
                    if(set !== null) {
                        tuning.p = set.p;
                        tuning.d = set.d;
                        tuning.i = set.i;
                        tuning.target = set.target;
                        tuning.period = set.period;
                    }
                }
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
