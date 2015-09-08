var app = angular.module('dnaApp',[]).controller('dnaCtrl',
    function dnaCtrl($scope, $http) {
        $http.get("../../../sampleJson/Risk.json").then(function (res) {
        
            $scope.dnaData = res.data;

        });
        $scope.showPopover = function () {
           
            this.popoverIsVisible = true;
            

        };
        $scope.hidePopover = function () {
            
            this.popoverIsVisible = false;
           
        };
        $scope.showPopover1 = function () {
            this.popoverIsVisible1 = true;
            
        };
        $scope.hidePopover1 = function () {
            this.popoverIsVisible1 = false;
        };
      }
);