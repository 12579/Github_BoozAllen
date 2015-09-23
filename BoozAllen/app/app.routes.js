(function() {

    'use strict';

    var app = angular.module('riskCanvasApp', ['ui.router', 'angularGrid', 'nvd3ChartDirectives', 'ngVis']);

    app.service('ShareData', function() {
        return {};
    });

    app.service('globals', function() {

        this.defaultVars = {
            w: angular.element(window).width(),
            winRef: 1920,
            initScroll: (function(el) {
                setTimeout(function() {
                    var elem = document.querySelector(el);
                    angular.element(elem).mCustomScrollbar({
                        theme: "inset"
                    });
                }, 100);
            }),
            getVendor: (function() {
                var styles = window.getComputedStyle(document.documentElement, ''),
                    pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/))[1],
                    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
                return {
                    sdom: dom,
                    lowercase: pre,
                    css: '-' + pre + '-',
                    js: pre[0].toUpperCase() + pre.substr(1)
                };
            })()
        };
    });

    app.factory("authenticationSvc", [
        "$http", "$q", "$window", function($http, $q, $window) {
            var userInfo;
            var getUserData = function(obj, userName, password) {
                var returResult = false;
                jQuery.each(obj, function(key, info) {
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
                    function(result) {
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
                    function(error) {
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
                    .then(function(result) {
                        userInfo = null;
                        $window.sessionStorage["userInfo"] = null;
                        deferred.resolve(result);
                    }, function(error) {
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
    app.config(function($stateProvider, $urlRouterProvider) {
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
            })
            .state('Home.entityDetail', {
                url: '/entityDetails',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/entityDetails/entityDetail.html',
                        controller: 'entityDetailCtrl'
                    }
                }
            })
            .state('Home.caseDetails', {
                url: '/caseDetails',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/caseDetails/caseDetailView.html',
                        controller: 'caseDetailCtrl'
                    }
                }
            })
            .state('Home.alertDetails', {
                url: '/alertDetails',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/alertDetails/alertDetailView.html',
                        controller: 'alertDetailCtrl'
                    }
                }
            })
               .state('Home.caseEntityDetails', {
                   url: '/caseEntityDetails',
                   views: {
                       'main@Home':
                       {
                           templateUrl: 'app/components/caseEntityDetails/caseEntityDetails.html',
                           controller: 'caseEntityDetailCtrl'
                       }
                   }
               })
            .state('Home.periodicReviewDetails', {
                url: '/periodicReviewDetails',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/periodicReviewDetails/periodicReviewDetailView.html',
                        controller: 'periodicReviewDetailCtrl'
                    }
                }
            })
             .state('Home.onboardingReviewDetails', {
                 url: '/onboardingReviewDetails',
                 views: {
                     'main@Home':
                     {
                         templateUrl: 'app/components/onboardingReviewDetails/onboardingReviewDetailView.html',
                         controller: 'onboardingReviewDetailCtrl'
                     }
                 }
             })
            .state('Home.TabsCodeDocNotesTasks', {
                url: '/TabsCodeDocNotesTasks',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/caseDetails/TabsCodeDocNotesTasks.html',
                        controller: 'TabsCodeDocNotesTasksCtrl'
                    }
                }
            })
            .state('Home.adminDetail', {
                url: '/adminDetail',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/admin/adminView.html',
                        controller: 'adminCtrl'
                    }
                }
            });
    });

    app.directive('tabs', function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {},
                controller: [
                    "$scope", function($scope) {
                        var panes = $scope.panes = [];

                        $scope.select = function(pane, index) {
                            angular.forEach(panes, function(pane) {
                                pane.selected = false;
                                jQuery('.gridSearch .searchInput').removeClass('active');
                                var elem = jQuery('.gridSearch .searchInput')[index];
                                jQuery(elem).addClass('active');
                            });
                            pane.selected = true;
                        };
                        this.addPane = function(pane) {
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
                        '{{pane.tabTitle}}<span class="num">{{pane.num}}</span></a>' +
                        '</li>' +
                        '</ul>' +
                        '<div class="tab-content" ng-transclude></div>' +
                        '</div>',
                replace: true
            };
        })
        .directive('pane', function() {
            return {
                require: '^tabs',
                restrict: 'E',
                transclude: true,
                scope: { tabTitle: '@', icon: '@', num: '@' },
                link: function(scope, element, attrs, tabsCtrl) {
                    tabsCtrl.addPane(scope);
                },
                template:
                    '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                        '</div>',
                replace: true
            };
        });

    app.directive('entityTabsOne', function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {},
                controller: [
                    "$scope", function($scope) {
                        var panes = $scope.panes = [];

                        $scope.select = function(pane, index) {
                            angular.forEach(panes, function(pane) {
                                pane.selected = false;
                                jQuery('.gridSearch .searchInput').removeClass('active');
                                var elem = jQuery('.gridSearch .searchInput')[index];
                                jQuery(elem).addClass('active');
                            });
                            pane.selected = true;
                        };
                        this.addPane = function(pane) {
                            if (panes.length === 0) $scope.select(pane);
                            panes.push(pane);
                        };
                    }
                ],
                template:
                    '<div class="tabbable">' +
                        '<ul class="nav nav-tabs">' +
                        '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' +
                        '<a href="" ng-click="select(pane, $index)">' +
                        '{{pane.tabTitle}}</a>' +
                        '</li>' +
                        '</ul>' +
                        '<div class="tab-content" ng-transclude></div>' +
                        '</div>',
                replace: true
            };
        })
        .directive('entityPaneOne', function() {
            return {
                require: '^entityTabsOne',
                restrict: 'E',
                transclude: true,
                scope: { tabTitle: '@' },
                link: function(scope, element, attrs, tabsCtrl) {
                    tabsCtrl.addPane(scope);
                },
                template:
                    '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                        '</div>',
                replace: true
            };
        });

    app.directive('entityTabsTwo', function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {},
                controller: [
                    "$scope", function($scope) {
                        var panes = $scope.panes = [];

                        $scope.select = function(pane, index) {
                            angular.forEach(panes, function(pane) {
                                pane.selected = false;
                                jQuery('.gridSearch .searchInput').removeClass('active');
                                var elem = jQuery('.gridSearch .searchInput')[index];
                                jQuery(elem).addClass('active');
                            });
                            pane.selected = true;
                        };
                        this.addPane = function(pane) {
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
                        '{{pane.tabTitle}}</a>' +
                        '</li>' +
                        '</ul>' +
                        '<div class="tab-content" ng-transclude></div>' +
                        '</div>',
                replace: true
            };
        })
        .directive('entityPaneTwo', function() {
            return {
                require: '^entityTabsTwo',
                restrict: 'E',
                transclude: true,
                scope: { tabTitle: '@', icon: '@' },
                link: function(scope, element, attrs, tabsCtrl) {
                    tabsCtrl.addPane(scope);
                },
                template:
                    '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                        '</div>',
                replace: true
            };
        });

    app.directive('adminTabs', function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {},
                controller: [
                    "$scope", function($scope) {
                        var panes = $scope.panes = [];

                        $scope.select = function(pane, index) {
                            angular.forEach(panes, function(pane) {
                                pane.selected = false;
                                jQuery('.gridSearch .searchInput').removeClass('active');
                                var elem = jQuery('.gridSearch .searchInput')[index];
                                jQuery(elem).addClass('active');
                            });
                            pane.selected = true;
                        };
                        this.addPane = function(pane) {
                            if (panes.length === 0) $scope.select(pane);
                            panes.push(pane);
                        };
                    }
                ],
                template:
                    '<div class="tabbable">' +
                        '<ul class="nav nav-tabs col-md-2">' +
                        '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' +
                        '<a href="" ng-click="select(pane, $index)"><i class="{{pane.icon}}"></i>' +
                        '{{pane.tabTitle}}</a>' +
                        '</li>' +
                        '</ul>' +
                        '<div class="tab-content col-md-10" ng-transclude></div>' +
                        '</div>',
                replace: true
            };
        })
        .directive('adminPane', function() {
            return {
                require: '^adminTabs',
                restrict: 'E',
                transclude: true,
                scope: { tabTitle: '@', icon: '@' },
                link: function(scope, element, attrs, tabsCtrl) {
                    tabsCtrl.addPane(scope);
                },
                template:
                    '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                        '</div>',
                replace: true
            };
        });

})();

