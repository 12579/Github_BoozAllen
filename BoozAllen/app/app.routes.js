/// <reference path="components/dashboard/dashboardViewNew.html" />
////-------New Configuration--------\\

(function () {

    'use strict';

    var app = angular.module('myApp', ['ui.router', 'angularGrid', 'nvd3ChartDirectives']);

    app.factory("authenticationSvc", [
        "$http", "$q", "$window", function($http, $q, $window) {
            var userInfo;
            var getUserData = function(obj, userName, password) {
                var returResult = false;
                jQuery.each(obj, function(key, info) {
                    if (info.UserName.toLowerCase() == userName.toLowerCase() && info.Password == password) {
                        userInfo =
                        {
                            accessToken: 'token', //result.data.access_token, Not defined
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
            }

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
                var serviceBase = 'http://localhost:50138/api/logout';
                $http({
                        method: "POST",
                        url: "/api/logout",
                        //url:serviceBase,
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
                            templateUrl: 'app/components/Home.html',
                            //controller: 'IndexCtrl'
                        },
                    'header@Home': { templateUrl: 'app/shared/header/headerView.html', controller: 'headerCtrl' }, //controller: 'menuCtrl' , controller: 'headerCtrl'
                    'footer@Home': { templateUrl: 'app/shared/footer/footerView.html', },
                    'menu@Home': { templateUrl: 'app/shared/menu/menuView.html', controller: 'menuCtrl' }, //, controller: 'menuCtrl'
                    //'main@Home': { templateUrl: 'app/components/Details.html', },
                }
            })
            .state('Home.dashboard', {
                url: '/dashboard',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/dashboard/dashboardViewNew.html',
                        controller: 'DashboardCtrl'
                    },
                },
            })
            .state('Home.ddDashboard', {
                url: '/ddDashboard',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/ddDashboard/dddashboardView.html',
                        controller: 'DdDashboardCtrl'
                    },
                },
            })
            .state('Home.managerDashboard', {
                url: '/managerDashboard',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/managerDashboard/managerDashboardView.html',
                        controller: 'ManagerDashboardCtrl'
                    },
                },
            })
            .state('Home.adminDashboard', {
                url: '/adminDashboard',
                views: {
                    'main@Home':
                    {
                        templateUrl: 'app/components/adminDashboard/adminDashboardView.html',
                        controller: 'ManagerDashboardCtrl'
                    },
                },
            })
        //.state('Home.Menu.detail', {
        //    url: '/:id',
        //    views: {
        //        '@index': {
        //            templateUrl: 'detail.html',
        //            controller: 'DetailCtrl'
        //        },
        //        'list2detailtip': {
        //            template: '<div>current selection is {{id}}</div>',
        //            controller: 'DetailCtrl'
        //        },
        //    },
        //})
    });
    //app.controller('IndexCtrl', function() {});

   
    app.directive('extendedPieChart', function () {
        "use strict";
        return {
            restrict: 'E',
            require: '^nvd3PieChart',
            link: function ($scope, $element, $attributes, nvd3PieChart) {
                $scope.d3Call = function (data, chart) {
                    //                       return d3.select('#' + $scope.id + ' svg')
                    //                               .datum(data)
                    //                               .transition()
                    //                               .duration(500)
                    //                               .call(chart);
                    var svg = d3.select('#' + $scope.id + ' svg')
                        .datum(data);
                    var path = svg.selectAll('path');
                    path.data(data)
                    .transition()
                    .ease("linear")
                    .duration(500)
                    return svg.transition()
                        .duration(500)
                        .call(chart);
                }
            }
        }
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
                    }

                    this.addPane = function (pane) {
                        if (panes.length == 0) $scope.select(pane);
                        panes.push(pane);
                    }
                }
            ],
            template:
                '<div class="tabbable">' +
                    '<ul class="nav nav-tabs">' +
                    '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' +
                    '<a href="" ng-click="select(pane, $index)"><i class="{{pane.icon}}"></i>' +
                    '{{pane.title}}</a>' +
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
                scope: { title: '@', icon: '@' },
                link: function (scope, element, attrs, tabsCtrl) {
                    tabsCtrl.addPane(scope);
                },
                template:
                    '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                        '</div>',
                replace: true
            };
        });

    app.directive('extendedPieChart', function () {
        "use strict";
        return {
            restrict: 'E',
            require: '^nvd3PieChart',
            link: function ($scope, $element, $attributes, nvd3PieChart) {
                $scope.d3Call = function (data, chart) {
                    //                       return d3.select('#' + $scope.id + ' svg')
                    //                               .datum(data)
                    //                               .transition()
                    //                               .duration(500)
                    //                               .call(chart);
                    var svg = d3.select('#' + $scope.id + ' svg')
                        .datum(data);
                    var path = svg.selectAll('path');
                    path.data(data)
                    .transition()
                    .ease("linear")
                    .duration(500)
                    return svg.transition()
                        .duration(500)
                        .call(chart);
                }
            }
        }
    });

    !function () {
        app.controller("oci.treeview.ctrl", [
                "$scope",
                function (a) {
                    function b(c) {
                        "collapsed" !== a.defaultNodeState && (a.defaultNodeState = "expanded"),
                            c && void 0 === c.state && (c.children && c.children.length > 0 ? (c.state = a.defaultNodeState, c.children.forEach(b)) : c.state = "leaf")
                    }

                    b(a.tree),
                        a.context = a.context || {},
                        a.selectNode = function (b) {
                            function c() {
                                "expanded" === b.state ? b.state = "collapsed" : "collapsed" === b.state && (b.state = "expanded")


                            }

                            a.$emit("nodeSelected", b, a.context);
                            var d = a.onSelectNode && a.onSelectNode(b);
                            d && d.then ? d.then(c) : c();

                        }, "false" !== a.selectTranscluded && (a.clickOnTranscluded = !0)
                }
        ]),
            app.directive("oci.treeview", [
                "$compile", function (a) {
                    return {
                        restrict: "E",
                        transclude: !0,
                        scope: { tree: "=", context: "=?", onSelectNode: "=?", defaultNodeState: "@", selectTranscluded: "@" },
                        controller: "oci.treeview.ctrl",
                        template: '<div class="tree"> <span ng-click="clickOnTranscluded && selectNode(tree)" ng-transclude ></span>   '
                            + '<ul ng-if="tree.state === \'expanded\'">       '
                            + '<li ng-repeat="node in tree.children">           '
                            + '<i ng-class="node.state" ng-click="selectNode(node)"></i>           '
                            + '<oci.treeview tree="node" context="context" on-select-node="onSelectNode" select-transcluded="{{selectTranscluded}}" '
                            + 'default-node-state="{{defaultNodeState}}">               <span ng-transclude></span>           </oci.treeview>       </li>   </ul></div>',
                        compile: function (b, c, d) {
                            var e, f = b.contents().remove();
                            return function (b, c) { e || (e = a(f, d)), e(b, function (a) { c.append(a) }) }
                        }
                    }
                }
            ])
    }();

})();

