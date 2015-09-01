var app = angular.module("nvd3TestApp", ['nvd3ChartDirectives']).controller('ExampleCtrl',
    function ExampleCtrl($scope) {
        $scope.exampleData = [
            {
                key: "< 5 Days",
                y: 5
            },
            {
                key: "6-10 Days",
                y: 2
            },
            {
                key: "11-20 Days",
                y: 9
            },
            {
                key: "20 Days +",
                y: 7
            }
        ];

       
        $scope.xFunction = function () {
            return function (d) {
                return d.key;
            };
        }
        $scope.yFunction = function () {
            return function (d) {
                return d.y;
            };
        }

        $scope.descriptionFunction = function () {
            return function (d) {
                return d.key;
            }
        }

        $scope.toolTipContentFunction = function () {
            return function (key, x, y, e, graph) {
                return '<b>' + key + '</b>';
            }
        }
        var colorArray = [  '#CC0000', '#FF8666', '#FF3333', '#FF6666', '#FFE6E6'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
        }
    });
