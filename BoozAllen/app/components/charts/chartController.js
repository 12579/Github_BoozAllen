angular.module("nvd3TestApp", ['nvd3ChartDirectives']).controller('ExampleCtrl1',
    function ExampleCtrl1($scope, $http) {
        $http.get("../../../sampleJson/barChart.json").then(function (res) {
            $scope.exampleData = res.data;

        });

        $scope.$on('tooltipShow.directive', function (event) {
            console.log('scope.tooltipShow', event);
        });

        $scope.$on('tooltipHide.directive', function (event) {
            console.log('scope.tooltipHide', event);
        });
        $scope.toolTipContentFunction = function () {
            return function (key, x, y, e, graph) {
                return '<b>' + x + '</b>';
            }
        }




        $http.get("../../../sampleJson/pieChart.json").then(function (res) {
            $scope.exampleData1 = res.data;

        });
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

        $scope.toolTipContentFunction1 = function () {
            return function (key, x, y, e, graph) {
                return '<b>' + key + '</b>';
            }
        }
        var colorArray = ['#CC0000', '#FF8666', '#FF3333', '#FF6666', '#FFE6E6'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
        }


    }
);

