(function () {
    'use strict';

    angular.module('riskCanvasApp')
        .controller('LoginCtrl', ["$state", "$scope", "$stateParams", "authenticationSvc", function ($state, $scope, $stateParams, authenticationSvc) {
            jQuery("#spnUsername").hide();
            jQuery("#spnPassword").hide();
            jQuery("#spnError").hide();

            $scope.OnClickUserName = function () {
                jQuery("#spnUsername").hide();
                jQuery('.loginBox').removeClass('hasError');
                jQuery("#spnError").hide();
            };

            $scope.OnClickPassword = function () {
                jQuery("#spnUsername").hide();
                jQuery("#spnError").hide();
                jQuery('.loginBox').removeClass('hasError');
            };

            $scope.userInfo = null;

            $scope.login = function () {
                var userName = $scope.username;
                var password = $scope.password;

                jQuery("#spnUsername").hide();
                jQuery("#spnPassword").hide();
                jQuery("#spnError").hide();

                if (userName == undefined) {
                    jQuery("#spnUsername").show();
                    jQuery("#spnPassword").hide();
                    jQuery("#spnError").hide();
                }
                else if (userName === '') {
                    jQuery("#spnUsername").show();
                    jQuery("#spnPassword").hide();
                    jQuery("#spnError").hide();
                }
                else if (password == undefined) {
                    jQuery("#spnPassword").show();
                    jQuery("#spnUsername").hide();
                    jQuery("#spnError").hide();
                }
                else if (password === '') {
                    jQuery("#spnPassword").show();
                    jQuery("#spnUsername").hide();
                    jQuery("#spnError").hide();
                }
                else {
                    authenticationSvc.login(userName, password)
                        .then(
                         function (result) {
                             if (result.ErrorMessage !== '') {
                                 $scope.ErrorMessage = "Invalid credentials";
                                 jQuery("#spnPassword").hide();
                                 jQuery("#spnUsername").hide();
                                 jQuery("#spnError").show();
                                 jQuery('.loginBox').addClass('hasError');

                             }
                             else {
                                 jQuery("#mainDiv").removeClass();
                                 if (result.Role === "Admin")
                                     $state.go('Home.adminDashboard', {});
                                 else if (result.Role === "FIU Analyst")
                                     $state.go('Home.dashboard', {});
                                 else if (result.Role === "DD Analyst")
                                     $state.go('Home.ddDashboard', {});
                                 else if (result.Role === "Manager")
                                     $state.go('Home.managerDashboard', {});
                                 else if (result.Role === "VP")
                                     $state.go('Home.managerDashboard', {});
                                 else
                                     jQuery("#spnError").show();
                             }
                         },
                        function () {
                            $(".LoginError").show();
                        });
                }
            }
        }
        ]);
})();