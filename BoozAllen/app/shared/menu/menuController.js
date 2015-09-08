


(function () {
    'use strict';

    angular
        .module('myApp')
    .controller('menuCtrl', ["$state", "$scope", "$stateParams", "$window", "authenticationSvc", function ($state, $scope, $stateParams, $window, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
       
        //var filename = "app/components/dashboard/dashboardView.html";
        ////filename = "app/components/managerDashboard/managerDashboardView.html";

        var userRole = userInfo.Role;
        if (userRole == "Admin")
            $state.go('Home.adminDashboard', {});
        else if (userRole == "Manager")
            $state.go('Home.managerDashboard', {});

        //$scope.OnMenuChange = function () {
        //    alert('on menunchnge');
        //};

        $scope.selectMenu = function (selec) {
            //var po = this;
            //alert(userRole);
            //alert('menu sele');
            $state.go('^');
            //if (userRole == "Admin")
            //    $state.go('Home.adminDashboard');
            //else if (userRole == "FIU Analyst")
            //    $state.go('Home.dashboard');
            //else if (userRole == "DD Analyst")
            //    $state.go('Home.dashboard');
            //else if (userRole == "Manager")
            //    $state.go('Home.managerDashboard');
            //else if (userRole == "VP")
            //    $state.go('Home.managerDashboard');
        }
    }
    ]);
})();