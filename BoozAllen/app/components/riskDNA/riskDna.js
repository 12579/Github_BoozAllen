var app = angular.module('dnaApp',[]).controller('dnaCtrl',
    function dnaCtrl($scope, $http) {
        $http.get("../../../sampleJson/Risk.json").then(function (res) {
            //alert(res.data);
            $scope.dnaData = res.data;
      });
      }
);