(function () {
    'use strict';

    angular.module('riskCanvasApp')
    .controller('headerCtrl', ["$state", "$scope", "$stateParams", "$window", "authenticationSvc", function ($state, $scope, $stateParams, $window, authenticationSvc) {

        function upperCaseNewValueHandler(fName, lName) {
            var finalVal = "";
            finalVal = fName.toUpperCase().substr(0, 1);
            finalVal += lName.toUpperCase().substr(0, 1);
            return finalVal;
        }
        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo == null) {
            $state.go('login');
        } else {
            var upperName = upperCaseNewValueHandler(userInfo.FName, userInfo.LName);
            $scope.FullName = userInfo.FName + " " + userInfo.LName;
            $scope.ShortName = upperName;
        }
        $scope.openHeadMenu = function () {
            var menu = angular.element(document.querySelector('#headMenu'));
            angular.element(menu).hasClass('ng-hide') ? angular.element(menu).addClass('ng-show').removeClass('ng-hide') : angular.element(menu).addClass('ng-hide').removeClass('ng-show');
            
//               if (!$('#headMenu').is(e.target) && $('#headMenu').has(e.target).length === 0)
//                   $('#headMenu').hide();

        }
        $scope.OpenProfilePage = function () {
            $state.go('home.profile');
        }
    }
    ]);
})();
