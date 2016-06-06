(function() {
    'use strict';

    function controller($resource, $interval, $scope) {
        var tuning = this;
        tuning.chart = {
            series: ['measeredTemp', 'correction', 'r_p', 'r_d', 'r_i', 'p', 'i', 'd', 'targetTemp', 'period', 'rotation'],
            data: [],
            labels: []
        };
        var labels = 1;
        for(var i = 0; i < 11; ++i) {
            tuning.chart.data[i] = [];
        }

        tuning.update = function() {
            $resource('/incubator/tuning').save({}, {
                temp: {
                    p: tuning.p,
                    d: tuning.d,
                    i: tuning.i,
                    target: tuning.targetTemp,
                    period: tuning.period
                },
                rotation: tuning.rotation
            }, function (response) {
            })
        };

        function last_data() {
            var length = tuning.chart.labels.length - 30;
            if(labels > 30) {
                labels = 30;
                tuning.chart.labels = tuning.chart.labels.splice(0, length);
                for(var i = 0; i < 11; ++i) {
                    tuning.chart.data[i] = tuning.chart.data[i].splice(0, length);
                }
            } else {
                tuning.chart.labels.push(labels++);
            }
        }

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
                        tuning.rotation = set.rotation;
                        if(tuning.chart.data[0] && tuning.chart.data[0].length) {
                            for(var i = 0; i < 11; ++i) {
                                tuning.chart.data[i].push(tuning[tuning.chart.series[i]]);
                            }
                            last_data();
                        } else {
                            get_data();
                        }
                    }
                }
            });
        }

        function get_data() {
            $resource('/incubator/tuning/data').get({}, {}, function(response) {
                if(response.data && response.data.length) {
                    var chart = tuning.chart;
                    for(var i = response.data.length - 1; i > -1; --i) {
                        var data = response.data[i];
                        if(data.temp.set) {
                            console.log(data);
                            chart.data[0].push(data.temp.data);
                            chart.data[1].push(data.temp.correction);
                            chart.data[2].push(data.temp.p);
                            chart.data[3].push(data.temp.i);
                            chart.data[4].push(data.temp.d);
                            chart.data[5].push(data.temp.set.p);
                            chart.data[6].push(data.temp.set.i);
                            chart.data[7].push(data.temp.set.d);
                            chart.data[8].push(data.temp.set.target);
                            chart.data[9].push(data.temp.set.period);
                            chart.data[10].push(data.temp.set.rotation);
                            last_data();
                        }
                    }
                }
            });
        }

        get();
        get_data();
        var interval = $interval(get, 10000);
        $scope.$on('$destroy', function() {
            $interval.cancel(interval);
        });

    }

    controller.$inject = ['$resource', '$interval', '$scope'];

    angular.module('incubator').controller('tuningController', controller);
})()
