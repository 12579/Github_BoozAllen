var app = angular.module("nvd3TestApp", ['nvd3ChartDirectives']).controller('ExampleCtrl1',
    function ExampleCtrl1($scope,$http) {
        $http.get("../../../sampleJson/SideChart.json").then(function (res) {
            $scope.exampleData = res.data;
           
        });
        var colorArray = ['#f9db22', '#5b5b5d', '#909090', '#c5c5c5'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
        }
    }
);