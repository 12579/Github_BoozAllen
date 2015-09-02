
var app = angular.module('myApp', ['ngRoute', 'angularGrid', 'nvd3ChartDirectives']);//, 'toaster'//'ngRoute' ,'ngAnimate', 'ngCookies'

app.factory("authenticationSvc", ["$http", "$q", "$window", function ($http, $q, $window) {
    var userInfo;

    function login(userName, password) {
        var deferred = $q.defer();

        var res = $http.get("../../../sampleJson/LoginDataJson.json");
        res.then(
            function (result) {
                if (result.data[0].UserName == userName && result.data[0].Password == password) {
                    userInfo =
                    {
                        accessToken: 'token', //result.data.access_token, Not defined
                        UserName: result.data[0].UserName,
                        ID: result.data[0].ID,
                        Email: result.data[0].Email,
                        ErrorMessage: ""
                    };
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
            },
            function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function logout()
    {
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

    $("#mainDiv").addClass('mainWrapper');
    $(".animatedImages").show();

    $scope.userInfo = null;

    $scope.login = function () {
        var userName = $scope.username;
        var password = $scope.password;

        if (userName == undefined) {
            $(".userEnter").show();
            $(".passwordEnter").hide();
            $(".user").hide();
            $(".LoginError").hide();
        }
        else if (userName == '') {
            $(".userEnter").show();
            $(".passwordEnter").hide();
            $(".user").hide();
            $(".LoginError").hide();
        }
        if (password == undefined) {
            $(".passwordEnter").show();
            $(".userEnter").hide();
            $(".user").hide();
            $(".LoginError").hide();
        }
        else if (password == '') {
            $(".passwordEnter").show();
            $(".userEnter").hide();
            $(".user").hide();
            $(".LoginError").hide();
        }
        else {
            authenticationSvc.login(userName, password)
                .then(
                function (result) {
                    if (result.ErrorMessage != '')
                    {
                        $scope.ErrorMessage = "Invalid credentials old";
                        $(".userEnter").hide();
                        $(".passwordEnter").hide();
                        $(".LoginError").hide();
                        $(".user").show();
                        $rootScope.userInfo = result;
                        $scope.userInfo = $rootScope.userInfo;
                    }
                    else {
                        $("#mainDiv").removeClass();
                        $scope.userInfo = result;
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
            headerName: "Entity Risk Score", field: "entityRiskScore", width: 70, filter: 'number',
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
        { headerName: "Estimated Progress", field: "", width: 70, suppressMenu: 'true' }
    ];

    var alertcolumnDefs = [
        { headerName: "ID", field: "id", width: 70, sort: 'asc' },
        { headerName: "Entity Name", field: "entityName", width: 150, suppressMenu: 'true' },
        { headerName: "Entity Risk Score", field: "entityRiskScore", width: 70, filter: 'number' },
        { headerName: "Account Type", field: "accountType", width: 150 },
        { headerName: "Account Number", field: "accountNumber", width: 150 },
        { headerName: "Alert Status", field: "alertStatus", width: 150 },
        { headerName: "Alert Open Date", field: "alertOpenDate", width: 100, suppressMenu: 'true' },
        { headerName: "Alert Due Date", field: "alertDueDate", width: 100 },
        { headerName: "Alert Type", field: "alertType", width: 70 }
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

    $http.get("../../../sampleJson/casesJson.json")
        .then(function (res) {
            $scope.gridOptions.rowData = res.data;
            $scope.gridOptions.api.onNewRows();
        });

    $http.get("../../../sampleJson/alertsJson.json")
        .then(function (res) {
            $scope.gridOptions1.rowData = res.data;
            $scope.gridOptions1.api.onNewRows();
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
            return '<b>' + x + '</b>';
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
