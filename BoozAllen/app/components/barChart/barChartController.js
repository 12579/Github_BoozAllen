var app = angular.module("nvd3TestApp", ['nvd3ChartDirectives']).controller('ExampleCtrl1',
    function ExampleCtrl1($scope,$http) {
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
                return '<b>' + x+ '</b>';
            }
        }
    }
);