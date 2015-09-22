(function () {

    'use strict';

    var app = angular.module('riskCanvasApp', ['ui.router', 'angularGrid', 'nvd3ChartDirectives', 'ngVis']);

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
            })
           .state('Home.dashboard.entityDetail', {
               url: '/entityDetails',
               views: {
                   'main@Home':
                   {
                       templateUrl: 'app/components/entityDetails/entityDetail.html',
                       controller: 'entityDetailCtrl'
                   }
               }
           })
           ;
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
                    '{{pane.tabTitle}}<span class="num">{{pane.num}}</span></a>' +
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
            scope: { tabTitle: '@', icon: '@', num: '@' },
            link: function (scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            template:
                '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                    '</div>',
            replace: true
        };
    });

    app.directive('entityTabsOne', function () {
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
                    '<a href="" ng-click="select(pane, $index)">' +
                    '{{pane.tabTitle}}</a>' +
                    '</li>' +
                    '</ul>' +
                    '<div class="tab-content" ng-transclude></div>' +
                    '</div>',
            replace: true
        };
    })
    .directive('entityPaneOne', function () {
        return {
            require: '^entityTabsOne',
            restrict: 'E',
            transclude: true,
            scope: { tabTitle: '@' },
            link: function (scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            template:
                '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                    '</div>',
            replace: true
        };
    });

    app.directive('entityTabsTwo', function () {
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
                    '{{pane.tabTitle}}</a>' +
                    '</li>' +
                    '</ul>' +
                    '<div class="tab-content" ng-transclude></div>' +
                    '</div>',
            replace: true
        };
    })
    .directive('entityPaneTwo', function () {
        return {
            require: '^entityTabsTwo',
            restrict: 'E',
            transclude: true,
            scope: { tabTitle: '@', icon: '@' },
            link: function (scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            template:
                '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                    '</div>',
            replace: true
        };
    });
    app.directive('checklistModel', ['$parse', '$compile', function ($parse, $compile) {
        // contains
        function contains(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        // add
        function add(arr, item, comparator) {
            arr = angular.isArray(arr) ? arr : [];
            if (!contains(arr, item, comparator)) {
                arr.push(item);
            }
            return arr;
        }

        // remove
        function remove(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }
            return arr;
        }

        // http://stackoverflow.com/a/19228302/1458162
        function postLinkFn(scope, elem, attrs) {
            // exclude recursion, but still keep the model
            var checklistModel = attrs.checklistModel;
            attrs.$set("checklistModel", null);
            // compile with `ng-model` pointing to `checked`
            $compile(elem)(scope);
            attrs.$set("checklistModel", checklistModel);

            // getter / setter for original model
            var getter = $parse(checklistModel);
            var setter = getter.assign;
            var checklistChange = $parse(attrs.checklistChange);

            // value added to list
            var value = attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;


            var comparator = angular.equals;

            if (attrs.hasOwnProperty('checklistComparator')) {
                if (attrs.checklistComparator[0] == '.') {
                    var comparatorExpression = attrs.checklistComparator.substring(1);
                    comparator = function (a, b) {
                        return a[comparatorExpression] === b[comparatorExpression];
                    }

                } else {
                    comparator = $parse(attrs.checklistComparator)(scope.$parent);
                }
            }

            // watch UI checked change
            scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                var current = getter(scope.$parent);
                if (angular.isFunction(setter)) {
                    if (newValue === true) {
                        setter(scope.$parent, add(current, value, comparator));
                    } else {
                        setter(scope.$parent, remove(current, value, comparator));
                    }
                }

                if (checklistChange) {
                    checklistChange(scope);
                }
            });

            // declare one function to be used for both $watch functions
            function setChecked(newArr, oldArr) {
                scope[attrs.ngModel] = contains(newArr, value, comparator);
            }

            // watch original model change
            // use the faster $watchCollection method if it's available
            if (angular.isFunction(scope.$parent.$watchCollection)) {
                scope.$parent.$watchCollection(checklistModel, setChecked);
            } else {
                scope.$parent.$watch(checklistModel, setChecked, true);
            }
        }

        return {
            restrict: 'A',
            priority: 1000,
            terminal: true,
            scope: true,
            compile: function (tElement, tAttrs) {
                if ((tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox')
                    && (tElement[0].tagName !== 'MD-CHECKBOX')
                    && (!tAttrs.btnCheckbox)) {
                    throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.';
                }

                if (!tAttrs.checklistValue && !tAttrs.value) {
                    throw 'You should provide `value` or `checklist-value`.';
                }

                // by default ngModel is 'checked', so we set it if not specified
                if (!tAttrs.ngModel) {
                    // local scope var storing individual checkbox model
                    tAttrs.$set("ngModel", "checked");
                }

                return postLinkFn;
            }
        };
    }]);
})();

