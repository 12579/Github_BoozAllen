var app = angular.module('dnaApp', ['dnaDirectives']).controller('dnaCtrl',
    function dnaCtrl($scope, $http) {
        $http.get("../../../sampleJson/Risk.json").then(function (res) {
            $scope.dnaData = res.data;
        });
        
    }
);