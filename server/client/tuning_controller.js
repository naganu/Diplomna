(function() {
    'use strict';

    function controller($resource, $interval, $scope) {
        var tuning = this;

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
                        tuning.targetTemp = set.target;
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
