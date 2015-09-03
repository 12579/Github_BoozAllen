//'ui.router'
var app = angular.module('myApp', ['ngRoute', 'angularGrid', 'nvd3ChartDirectives']);//, 'toaster'//'ngRoute' ,'ngAnimate', 'ngCookies'

app.factory("authenticationSvc", ["$http", "$q", "$window", function ($http, $q, $window) {
    var userInfo;

    var getUserData = function (obj, userName, password) {
        var returResult = false;

        jQuery.each(obj, function (key, info) {
            if (info.UserName.toLowerCase() == userName.toLowerCase() && info.Password == password) {
                userInfo =
                {
                    accessToken: 'token', //result.data.access_token, Not defined
                    UserName: info.UserName,
                    ID: info.ID,
                    Email: info.Email,
                    Role:info.Role,
                    ErrorMessage: ""
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
            function (result) {
                var resultStatus = getUserData(result.data, userName, password);

                if (resultStatus) {
                    $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                    deferred.resolve(userInfo);
                }
                else {
                    userInfo =
                    {
                        ErrorMessage: "Invalid Credential"
                    };
                    deferred.resolve(userInfo);
                }


                //if (result.data[0].UserName == userName && result.data[0].Password == password) {
                //    userInfo =
                //    {
                //        accessToken: 'token', //result.data.access_token, Not defined
                //        UserName: result.data[0].UserName,
                //        ID: result.data[0].ID,
                //        Email: result.data[0].Email,
                //        ErrorMessage: ""
                //    };
                //    $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                //    deferred.resolve(userInfo);
                //}
                //else {
                //    userInfo =
                //    {
                //        ErrorMessage: "Invalid Credential"
                //    };
                //    deferred.resolve(userInfo);
                //}
            },
            function (error) {
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
        .then(function (result) {
            userInfo = null;
            $window.sessionStorage["userInfo"] = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function getUserInfo() {
        return userInfo;
    }

    function init() {
        if ($window.sessionStorage["userInfo"]) {
            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        }
    }
    init();

    return {
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
}]);

app.controller("LoginController", ["$scope", "$location", "$window", "$rootScope", "authenticationSvc", function ($scope, $location, $window, $rootScope, authenticationSvc) {
    
   
    //$("#mainDiv").addClass('mainWrapper');
    //$(".animatedImages").show();

    jQuery("#spnUsername").hide();
    jQuery("#spnPassword").hide();
    jQuery("#spnError").hide();


    $scope.OnClickUserName = function () {
        jQuery("#spnUsername").hide();
    };

    $scope.OnClickPassword = function () {
        jQuery("#spnUsername").hide();
    };

    

    $scope.userInfo = null;

    $scope.login = function () {
        var userName = $scope.username;
        var password = $scope.password;

        //spnUsername
        //spnPassword
        //spnError

       jQuery("#spnUsername").hide();
       jQuery("#spnPassword").hide();
       jQuery("#spnError").hide();

        if (userName == undefined) {
           jQuery("#spnUsername").show();
           jQuery("#spnPassword").hide();
           jQuery("#spnError").hide();
        }
        else if (userName == '')
        {
           jQuery("#spnUsername").show();
           jQuery("#spnPassword").hide();
           jQuery("#spnError").hide();
        }
        else if (password == undefined) {
           jQuery("#spnPassword").show();
           jQuery("#spnUsername").hide();
           jQuery("#spnError").hide();
        }
        else if (password == '') {
           jQuery("#spnPassword").show();
           jQuery("#spnUsername").hide();
           jQuery("#spnError").hide();
        }
        else {
            authenticationSvc.login(userName, password)
                .then(
                function (result) {
                    if (result.ErrorMessage != '')
                    {
                        $scope.ErrorMessage = "Invalid credentials";
                       jQuery("#spnPassword").hide();
                       jQuery("#spnUsername").hide();
                       jQuery("#spnError").show();
                        $rootScope.userInfo = result;
                        $scope.userInfo = $rootScope.userInfo;
                    }
                    else {
                       jQuery("#mainDiv").removeClass();
                        $scope.userInfo = result;
                        if (result.Role == "Admin")
                            $location.path("/adminDashboard");
                        else if (result.Role == "Manager")
                            $location.path("/managerDashboard");
                        else
                        $location.path("/dashboard");
                    }
                },
                function (error) {
                    $(".LoginError").show();
                });
        }
    };
}]);

app.controller("HomeController", ["$scope", "$location", "authenticationSvc", "auth", function ($scope, $location, authenticationSvc, auth) {
    $scope.userInfo = auth;

    $scope.logout = function () {
        authenticationSvc.logout()
            .then(function (result) {
                $scope.userInfo = null;
                $location.path("/login");
            }, function (error) {
                console.log(error);
            });
    };
}]);
app.controller("DashboardCtrl", function ($scope, $http, $rootScope) {
    //, suppressMenu: 'true'

    var userInfo = $rootScope.userInfo;
    $scope.userInfo = userInfo;

    var casecolumnDefs = [
        { headerName: "ID", field: "id", width: 70, sort: 'asc' },
        { headerName: "Entity Name", field: "entityName", width: 150, suppressMenu: 'true' },
        {
            headerName: "Entity Risk Score", field: "entityRiskScore", width: 100, filter: 'number',
            // cellClassRules: {
            //    'rag-green': 'x < 33.334',
            //    'rag-amber': 'x >= 33.334 && x < 66.667',
            //    'rag-red': 'x >= 66.667'
            //}

            cellStyle: function (params) {
                if (params.value < 33.334) {
                    return { color: 'green' };
                } else if (params.value >= 33.334 && params.value < 66.667) {
                    return { color: 'yellow' };
                }
                else if (params.value >= 66.667) {
                    return { color: 'red' };
                }
            }
        },
        { headerName: "Account Type", field: "accountType", width: 150 },
        { headerName: "Account Number", field: "accountNumber", width: 150 },
        { headerName: "Case Status", field: "caseStatus", width: 150 },
        { headerName: "Case Open Date", field: "caseOpenDate", width: 100, suppressMenu: 'true' },
        { headerName: "Case Due Date", field: "caseDueDate", width: 100 },
        { headerName: "Estimated Progress", field: "", width: 100, suppressMenu: 'true' }
    ];

    var alertcolumnDefs = [
        { headerName: "ID", field: "id", width: 70, sort: 'asc' },
        { headerName: "Entity Name", field: "entityName", width: 150, suppressMenu: 'true' },
        { headerName: "Entity Risk Score", field: "entityRiskScore", width: 100, filter: 'number' },
        { headerName: "Account Type", field: "accountType", width: 150 },
        { headerName: "Account Number", field: "accountNumber", width: 150 },
        { headerName: "Alert Status", field: "alertStatus", width: 150 },
        { headerName: "Alert Open Date", field: "alertOpenDate", width: 100, suppressMenu: 'true' },
        { headerName: "Alert Due Date", field: "alertDueDate", width: 100 },
        { headerName: "Alert Type", field: "alertType", width: 100 }
    ];

    $scope.gridOptions = {
        columnDefs: casecolumnDefs,
        rowData: null,
        enableFilter: true,
        enableSorting: true
    };

    $scope.gridOptions1 = {
        columnDefs: alertcolumnDefs,
        rowData: null,
        enableFilter: true,
        enableSorting: true
    };

    //$scope.pieChart = "../pieChart/pieChartView.html";
    $http.get("../../../sampleJson/alertsJson.json")
        .then(function (res1) {
            $scope.gridOptions1.rowData = res1.data;
            $scope.gridOptions1.api.onNewRows();
            $scope.totalRowsCount = res1.data.length;
        });

    $http.get("../../../sampleJson/casesJson.json")
        .then(function (res) {
            $scope.gridOptions.rowData = res.data;
            $scope.gridOptions.api.onNewRows();
            $scope.totalRows = res.data.length;
        });




    $scope.kpiData = [
            {
                key: "quality kpi chart",
                values: [
                    ["Decision Quality", 5],
                    ["Analytic Quality", 10],
                    ["Research Quality", 15],
                    ["Technical Quality", 25]
                ]
            }
    ];

    $scope.exampleData = [
            {
                key: "Stacked bar chart",
                values: [
                    ["New", 5],
                    ["Data Collection", 10],
                    ["Machine Analytics", 15],
                    ["Awaiting Assignment", 25],
                    ["Human Analysis", 45],
                    ["Quality Assurance", 35],
                    ["Closed", 55]

                ]
            }
    ];

    $scope.$on('tooltipShow.directive', function (event) {
        console.log('scope.tooltipShow', event);
    });

    $scope.$on('tooltipHide.directive', function (event) {
        console.log('scope.tooltipHide', event);
    });
  

    $scope.toolTipContentFunction = function () {
        return function (key, x, y, e, graph) {
            return '<h5>' + x + '</h5>' 
        }
    }


    $scope.exampleData1 = [
            {
                key: "< 5 Days",
                y: 5
            },
            {
                key: "6-10 Days",
                y: 2
            },
            {
                key: "11-20 Days",
                y: 9
            },
            {
                key: "20 Days +",
                y: 7
            }
    ];


    $scope.xFunction = function () {
        return function (d) {
            return d.key;
        };
    }
    $scope.yFunction = function () {
        return function (d) {
            return d.y;
        };
    }

    $scope.descriptionFunction = function () {
        return function (d) {
            return d.key;
        }
    }

    $scope.toolTipContentFunction1 = function () {
        return function (key, x, y, e, graph) {
            return '<b>' + key + '</b>';
        }
    }
    var colorArray = ['#CC0000', '#FF8666', '#FF3333', '#FF6666', '#FFE6E6'];
    $scope.colorFunction = function () {
        return function (d, i) {
            return colorArray[i];
        };
    }

    $http.get('../../../sampleJson/menuJson.json').
       success(function (data) {
           $scope.treeData = data[0];
       }).error(function () {
       });

    $scope.getMoreData = function (node) {
        if (node.state === 'leaf') {
            $location.path(node.label);
        }
    };
    $scope.$on('nodeSelected', function (event, node, context) {
        if (context.selectedNode) {
            context.selectedNode.class = '';
        }

        node.class = 'selectedNode';
        context.selectedNode = node;
    });


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
app.directive('tabs', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: [
                "$scope", function($scope) {
                    var panes = $scope.panes = [];

                    $scope.select = function(pane) {
                        angular.forEach(panes, function(pane) {
                            pane.selected = false;
                        });
                        pane.selected = true;
                    }

                    this.addPane = function(pane) {
                        if (panes.length == 0) $scope.select(pane);
                        panes.push(pane);
                    }
                }
            ],
            template:
                '<div class="tabbable">' +
                    '<ul class="nav nav-tabs">' +
                    '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' +
                    '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
                    '</li>' +
                    '</ul>' +
                    '<div class="tab-content" ng-transclude></div>' +
                    '</div>',
            replace: true
        };
    }).
    directive('pane', function() {
        return {
            require: '^tabs',
            restrict: 'E',
            transclude: true,
            scope: { title: '@' },
            link: function(scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            template:
                '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                    '</div>',
            replace: true
        };
    });

app.controller("ManagerDashboardCtrl", function ($scope, $http, $rootScope) {
    var columnDefs = [
        {
            headerName: "ID", field: "id", hide: true
        },
        {
            headerName: "Analysts Name", field: "analystName", sort: "asc", width: 200,
            cellRenderer: function (params) {
                return '<a href=# title="Click to change KPI Data">' + params.value + '</a>';
            }
        },
        { headerName: "Open Cases", field: "openCases", filter: 'number', width: 120 },
        { headerName: "Action", field: "action", suppressMenu: 'true', suppressSorting: 'true', suppressSizeToFit: 'true', width: 400 }
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        enableFilter: true,
        enableSorting: true,
        headerRowHeight: 50
    };

    //$scope.pieChart = "../pieChart/pieChartView.html";

    $http.get("../../../sampleJson/analystsCases.json")
        .then(function (res) {
            $scope.gridOptions.rowData = res.data;
            $scope.gridOptions.api.onNewRows();
        });


    $scope.productionData = [
            {
                key: "production chart",
                values: [
                    ["New", 45],
                    ["In Progress", 30],
                    ["Closed", 50]

                ]
            }
    ];

    $scope.statusData = [
            {
                key: "Status chart",
                values: [
                    ["New", 45],
                    ["Data Collection", 10],
                    ["Transaction Review", 15],
                    ["Awaiting Assignment", 25],
                    ["Human Analysis", 45],
                    ["Due Diligence Review", 35],
                    ["Quality Assurance", 30],
                    ["Closed", 50]

                ]
            }
    ];

    $scope.kpiData = [
        {
            key: "quality kpi chart",
            values: [
                ["Decision Quality", 5],
                ["Analytic Quality", 10],
                ["Research Quality", 15],
                ["Technical Quality", 25]
            ]
        }
    ];

    $scope.toolTipContentFunction = function () {
        return function (key, x, y, e, graph) {
            return '<b>' + x + '</b>';
        }
    }

    $scope.ageingData = [
            {
                key: "Expiring Today",
                y: 5
            },
            {
                key: "Expiring This Week",
                y: 12
            },
            {
                key: "Expiring This Month",
                y: 9
            },
            {
                key: "Expiring in 3 Months",
                y: 7
            },
            {
                key: "Expiring in 6 Months",
                y: 2
            }
    ];

    $scope.assignedData = [
            {
                key: "Jack White",
                y: 24
            },
            {
                key: "Jill Black",
                y: 200
            },
            {
                key: "Mike Haul",
                y: 100
            },
            {
                key: "Margi White",
                y: 123
            }
    ];


    $scope.xFunction = function () {
        return function (d) {
            return d.key;
        };
    }
    $scope.yFunction = function () {
        return function (d) {
            return d.y;
        };
    }

    $scope.descriptionFunction = function () {
        return function (d) {
            return d.key;
        }
    }

    $scope.toolTipContentFunction1 = function () {
        return function (key, x, y, e, graph) {
            return '<b>' + key + '</b>';
        }
    }
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
    app.controller("oci.treeview.ctrl", ["$scope",
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
        }]),
    app.directive("oci.treeview", ["$compile", function (a) {
        return {
            restrict: "E", transclude: !0, scope: { tree: "=", context: "=?", onSelectNode: "=?", defaultNodeState: "@", selectTranscluded: "@" }, controller: "oci.treeview.ctrl",
            template: '<div class="tree"> <span ng-click="clickOnTranscluded && selectNode(tree)" ng-transclude ></span>   '
                + '<ul ng-if="tree.state === \'expanded\'">       '
                + '<li ng-repeat="node in tree.children">           '
                + '<i ng-class="node.state" ng-click="selectNode(node)"></i>           '
                + '<oci.treeview tree="node" context="context" on-select-node="onSelectNode" select-transcluded="{{selectTranscluded}}" '
            + 'default-node-state="{{defaultNodeState}}">               <span ng-transclude></span>           </oci.treeview>       </li>   </ul></div>',
            compile: function (b, c, d) { var e, f = b.contents().remove(); return function (b, c) { e || (e = a(f, d)), e(b, function (a) { c.append(a) }) } }
        }
    }])
}();
