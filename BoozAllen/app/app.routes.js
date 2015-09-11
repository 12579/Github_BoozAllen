(function () {

    'use strict';

    var app = angular.module('riskCanvasApp', ['ui.router', 'angularGrid', 'nvd3ChartDirectives']);

    app.service('ShareData', function () {
        return {};
    });

    app.factory("authenticationSvc", [
        "$http", "$q", "$window", function ($http, $q, $window) {
            var userInfo;
            var getUserData = function (obj, userName, password) {
                var returResult = false;
                jQuery.each(obj, function (key, info) {
                    if (info.UserName.toLowerCase() === userName.toLowerCase() && info.Password === password) {
                        userInfo =
                        {
                            accessToken: 'token',
                            UserName: info.UserName,
                            ID: info.ID,
                            Email: info.Email,
                            Role: info.Role,
                            ErrorMessage: "",
                            FName: info.FName,
                            LName: info.LName
                        };
                        returResult = true;
                    };
                });
                return returResult;
            };

            function login(userName, password) {
                var deferred = $q.defer();
                var res = $http.get("../../../sampleJson/LoginDataJson.json");
                res.then(
                    function (result) {
                        var resultStatus = getUserData(result.data, userName, password);
                        if (resultStatus) {
                            $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                            deferred.resolve(userInfo);
                        } else {
                            userInfo =
                            {
                                ErrorMessage: "Invalid Credential"
                            };
                            deferred.resolve(userInfo);
                        }
                    },
                    function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }

            function logout() {
                var deferred = $q.defer();
                $http({
                    method: "POST",
                    url: "/api/logout",
                    headers: {
                        "access_token": userInfo.accessToken
                    }
                })
                    .then(function (result) {
                        userInfo = null;
                        $window.sessionStorage["userInfo"] = null;
                        deferred.resolve(result);
                    }, function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }

            function init() {
                if ($window.sessionStorage["userInfo"]) {
                    userInfo = JSON.parse($window.sessionStorage["userInfo"]);
                }
            }

            function getUserInfo() {
                init();
                return userInfo;
            }


            init();
            return {
                login: login,
                logout: logout,
                getUserInfo: getUserInfo
            };
        }
    ]);
    app.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login',
            {
                url: '/login',
                templateUrl: 'app/login/LoginView.html',
                controller: 'LoginCtrl'
            })
            .state('Home',
            {
                url: "/Home",
                views:
                {
                    '@':
                        {
                            templateUrl: 'app/components/Home.html'
                        },
                    'header@Home': { templateUrl: 'app/shared/header/headerView.html', controller: 'headerCtrl' },
                    'footer@Home': { templateUrl: 'app/shared/footer/footerView.html' },
                    'menu@Home': { templateUrl: 'app/shared/menu/menuView.html', controller: 'menuCtrl' }
                }
            })
            .state('Home.dashboard', {
                url: '/dashboard',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/dashboard/dashboardViewNew.html',
                        controller: 'DashboardCtrl'
                    }
                }
            })
            .state('Home.ddDashboard', {
                url: '/ddDashboard',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/ddDashboard/dddashboardView.html',
                        controller: 'DdDashboardCtrl'
                    }
                }
            })
            .state('Home.managerDashboard', {
                url: '/managerDashboard',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/managerDashboard/managerDashboardView.html',
                        controller: 'ManagerDashboardCtrl'
                    }
                }
            })
            .state('Home.adminDashboard', {
                url: '/adminDashboard',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/adminDashboard/adminDashboardView.html',
                        controller: 'ManagerDashboardCtrl'
                    }
                }
            });
    });

    app.directive('tabs', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: [
                "$scope", function ($scope) {
                    var panes = $scope.panes = [];

                    $scope.select = function (pane, index) {
                        angular.forEach(panes, function (pane) {
                            pane.selected = false;
                            jQuery('.gridSearch .searchInput').removeClass('active');
                            var elem = jQuery('.gridSearch .searchInput')[index];
                            jQuery(elem).addClass('active');
                        });
                        pane.selected = true;
                    };
                    this.addPane = function (pane) {
                        if (panes.length === 0) $scope.select(pane);
                        panes.push(pane);
                    };
                }
            ],
            template:
                '<div class="tabbable">' +
                    '<ul class="nav nav-tabs">' +
                    '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' +
                    '<a href="" ng-click="select(pane, $index)"><i class="{{pane.icon}}"></i>' +
                    '{{pane.title}}<span class="num">{{pane.num}}</span></a>' +
                    '</li>' +
                    '</ul>' +
                    '<div class="tab-content" ng-transclude></div>' +
                    '</div>',
            replace: true
        };
    })
    .directive('pane', function () {
        return {
            require: '^tabs',
            restrict: 'E',
            transclude: true,
            scope: { title: '@', icon: '@', num: '@' },
            link: function (scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            template:
                '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                    '</div>',
            replace: true
        };
    });

})();

