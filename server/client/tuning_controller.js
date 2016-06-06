(function() {
    'use strict';

    function controller($resource, $interval, $scope) {
        var tuning = this;
        tuning.chart = {
            series: ['mesuredTemp', 'correction', 'r_p', 'r_d', 'r_i', 'p', 'i', 'd', 'targetTemp', 'period', 'rotation'],
            data: [],
            labels: []
        };
        var labels = 1;
        for(var i = 0; i < 2; ++i) {
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
                humi: {
                    target: tuning.targetHumi
                },
                rotation: tuning.rotation
            }, function (response) {
            })
        };

        function last_data(data) {
            if(labels > 20) {
                for(var i = 0; i < data.length; ++i) {
                    tuning.chart.data[i].shift();
                    tuning.chart.data[i].push(data[i]);
                }
            } else {
                tuning.chart.labels.push(labels++);
            }
        }

        function get() {
            $resource('/incubator/tuning').get({}, {}, function(response) {
                var temp = response.temp;
                var humi = response.humi;
                var set = response.set;
                if(temp) {
                    tuning.mesuredTemp = temp.data;
                    tuning.correction = temp.correction;
                    tuning.r_p = temp.p;
                    tuning.r_i = temp.i;
                    tuning.r_d = temp.d;
                }
                if(humi) {
                    tuning,mesuredHumi = humi.data;
                }
                if(temp && humi) {
                    last_data([tuning.mesuredTemp, tuning.mesuredHumi]);
                }
                if(set) {
                    tuning.p = set.temp.p;
                    tuning.d = set.temp.d;
                    tuning.i = set.temp.i;
                    tuning.targetTemp = set.temp.target;
                    tuning.period = set.temp.period;
                    tuning.targetHumi = set.humi.target;
                    tuning.rotation = set.rotation;
                }
            });
        }

        function get_data() {
            $resource('/incubator/tuning/data').get({}, {}, function(response) {
                if(response.data && response.data.length) {
                    var chart = tuning.chart;
                    for(var i = response.data.length - 1; i > -1; --i) {
                        var data = response.data[i];
                        last_data([data.temp.data, date.humi.data]);
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
