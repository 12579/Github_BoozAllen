var app = angular.module("nvd3TestApp", ['nvd3ChartDirectives']).controller('ExampleCtrl1',
    function ExampleCtrl1($scope) {
        $scope.exampleData = [
            {
                key: "Stacked bar chart",
                values: [
                    ["New", 5],
                    ["Data Collection", 10],
                    ["Machine Analytics", 15],
                    ["Awaiting Assignment", 25],
                    ["Human Analysis", 45],
                    ["Quality Assurance", 35],
                    ["Closed", 55]
                    
                ]
            }
        ];

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