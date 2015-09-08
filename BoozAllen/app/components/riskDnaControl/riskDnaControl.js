angular.module('dnaDirectives', [])
.directive('riskdna', [function () {
    //alert("hi");
    return {
        scope: {
            dnaData: '='
        },
        restrict: 'E',
        replace: false,
        templateUrl: 'riskDna.html',
        link: function (scope, element, attr) { }
    };
}]);

