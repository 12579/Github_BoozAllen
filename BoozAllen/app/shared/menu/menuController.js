


(function () {
    'use strict';

    angular
        .module('riskCanvasApp')
    .controller('menuCtrl', ["$state", "$scope", "$stateParams", "$window", "authenticationSvc", "ShareData", function ($state, $scope, $stateParams, $window, authenticationSvc, ShareData) {
        var userInfo = authenticationSvc.getUserInfo();
        var userRole = userInfo.Role;

        $scope.shareData = ShareData;
        $scope.shareData.alerts = 0;
        $scope.shareData.cases = 0;

        $scope.selectMenu = function (selMenu)
        {
            if (userRole == "Admin")
                $state.go('Home.adminDashboard', {});
            else if (userRole == "FIU Analyst")
                $state.go('Home.dashboard', {});
            else if (userRole == "DD Analyst")
                $state.go('Home.ddDashboard', {});
            else if (userRole == "Manager")
                $state.go('Home.managerDashboard', {});
            else if (userRole == "VP")
                $state.go('Home.managerDashboard', {});
            else 
                $state.go('Home.dashboard');
            //$state.go('^');
        }
    }
    ]);
})();