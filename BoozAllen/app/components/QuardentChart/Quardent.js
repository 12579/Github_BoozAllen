var app = angular.module("nvd3TestApp", []).controller('ExampleCtrl1',
    function ExampleCtrl1($scope, $http) {
        $http.get("../../../sampleJson/kpi.json").then(function (res) {
         
            $scope.exampleData = res.data;

        });
  }
);