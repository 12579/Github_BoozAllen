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
                    Role: info.Role,
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
        else if (userName == '') {
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
                    if (result.ErrorMessage != '') {
                        $scope.ErrorMessage = "Invalid credentials";
                        jQuery("#spnPassword").hide();
                        jQuery("#spnUsername").hide();
                        jQuery("#spnError").show();
                        jQuery('.loginBox').addClass('hasError');
                        jQuery('.loginBox .inputFields input').val("");
                        $rootScope.userInfo = result;
                        $scope.userInfo = $rootScope.userInfo;
                    }
                    else {
                        jQuery("#mainDiv").removeClass();
                        $scope.userInfo = result;
                        if (result.Role == "VP")
                            $location.path("/vpDashboard");
                        else if (result.Role == "Admin")
                            $location.path("/adminDashboard");
                        else if (result.Role == "Manager")
                            $location.path("/managerDashboard");
                        else if (result.Role == "DD Analyst")
                            $location.path("/ddDashboard");
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
    $http.get("../../../sampleJson/Risk.json").then(function (res) {
        $scope.dnaData = res.data;
    });
    var casecolumnDefs = [
        {
            headerName: "", field: "entityName", width: 95, suppressMenu: 'true', cellRenderer: upperCaseNewValueHandler,
            cellClass: 'rag-initial',
            cellClassRules: {
                'rag-green': function (params) { return params.data.entityRiskScore < 33.334 },
                'rag-amber': function (params) { return params.data.entityRiskScore >= 33.334 && params.data.entityRiskScore < 66.667 },
                'rag-red': function (params) { return params.data.entityRiskScore >= 66.667 }
            }
        },
        {
            headerName: "", field: "", width: 400, suppressMenu: 'true', cellClass: 'rag-entity', cellRenderer: function (params) {
                return '<span><b>' + params.data.entityName + '</b> -' + params.data.id + '<br />' + params.data.accountType + ' - ' + params.data.accountNumber + '</span>';
            }
        },
        {
            headerName: "RiskDNA",
            field: "entityRiskScore",
            width: 700,
            cellRenderer: riskDnaHandler

        },
        { headerName: "Case Status", field: "caseStatus", width: 150 },
        { headerName: "Case Type", field: "caseType", width: 100 },
        { headerName: "Case Open Date", field: "caseOpenDate", width: 100, suppressMenu: 'true' },
        { headerName: "Case Due Date", field: "caseDueDate", width: 100 }
    ];
    var alertcolumnDefs = [
        {
            headerName: "", field: "entityName", width: 95, suppressMenu: 'true', cellRenderer: upperCaseNewValueHandler,
            cellClass: 'rag-initial',
            cellClassRules: {
                'rag-green': function (params) { return params.data.entityRiskScore < 33.334 },
                'rag-amber': function (params) { return params.data.entityRiskScore >= 33.334 && params.data.entityRiskScore < 66.667 },
                'rag-red': function (params) { return params.data.entityRiskScore >= 66.667 }
            }
        },
        {
            headerName: "", field: "", width: 400, suppressMenu: 'true', cellClass: 'rag-entity', cellRenderer: function (params) {
                return '<span><b>' + params.data.entityName + '</b> -' + params.data.id + '<br />' + params.data.accountType + ' - ' + params.data.accountNumber + '</span>';
            }
        },
        {
            headerName: "RiskDNA",
            field: "entityRiskScore",
            width: 700,
            cellRenderer: riskDnaHandler

        },
        { headerName: "Alert Status", field: "alertStatus", width: 150 },
        { headerName: "Alert Type", field: "alertType", width: 100 },
        { headerName: "Alert Open Date", field: "alertOpenDate", width: 100, suppressMenu: 'true' },
        { headerName: "Alert Due Date", field: "alertDueDate", width: 100 }

    ];

    function upperCaseNewValueHandler(params) {
        var data = params.value.toUpperCase();
        var spl = data.split(' ');
        var finalVal = "";
        for (var i = 0; i < spl.length; i++) {
            if (i == 2) break;
            finalVal += spl[i].substr(0, 1);
        }
        return "<span>" + finalVal + "</span>";
    }

    function riskDnaHandler(params) {
        var data =
            '<div>'
                + '<div style="float: left; width: 100px; background-color: black;" ng-repeat="dna in dnaData.riskDNA.sequences">'
                + '<div style="float: left; background-color: white; height: 25px;">&nbsp;</div>'
                + '<div style="float: left;" ng-repeat="gene in dna.genes">'
                + '<div ng-style="{\'border-left\': \'2px solid gray\',\'height\': \'25px\', \'float\':\'left\'}" ng-show="gene.geneScore>=0 && gene.geneScore<33.33">&nbsp;</div>'
                + '<div ng-style="{\'border-left\' : \'2px solid yellow\',\'height\': \'25px\', \'float\':\'left\'}" ng-show="gene.geneScore>33.33 && gene.geneScore<66.66">&nbsp;</div>'
                + '<div ng-style="{\'border-left\': \'2px solid red\',\'height\': \'25px\', \'float\':\'left\'}" ng-show="gene.geneScore>66.66 && gene.geneScore<=100">&nbsp;</div>'
                + '</div>'
                + '</div>'
                + '<div style="float: left; width: 100px; background-color: black;">'
                + '<div style="float: left; background-color: white; height: 25px;">&nbsp;</div>'
                + '<div ng-style="{\'height\': \'25px\', \'float\':\'center\'}" ng-show="dnaData.riskDNA.riskDnaScore>=0 && dnaData.riskDNA.riskDnaScore<33.33"><span style="color: gray; font-size: 16px;margin-left: 40px; margin-bottom: -10px;">{{dnaData.riskDNA.riskDnaScore| number:0}}</span></div>'
                + '<div ng-style="{\'height\': \'25px\', \'float\':\'center\'}" ng-show="dnaData.riskDNA.riskDnaScore>33.33 && dnaData.riskDNA.riskDnaScore<66.66"><span style="color: yellow; font-size: 16px;margin-left: 40px; margin-bottom: -10px;">{{dnaData.riskDNA.riskDnaScore| number:0}}</span></div>'
                + '<div ng-style="{\'height\': \'25px\', \'float\':\'center\'}" ng-show="dnaData.riskDNA.riskDnaScore>66.66 && dnaData.riskDNA.riskDnaScore<=100"><span style="color: red; font-size: 16px; margin-left: 40px; margin-bottom: -10px;">{{dnaData.riskDNA.riskDnaScore| number:0}}</span></div>'
                + '</div>'
                + '</div>';
        return data;
    }

    $scope.gridOptions = {
        columnDefs: casecolumnDefs,
        rowData: null,
        headerHeight: 60,
        rowHeight: 80,
        enableFilter: true,
        enableSorting: true,
        angularCompileRows: true
    };

    $scope.gridOptions1 = {
        columnDefs: alertcolumnDefs,
        rowData: null,
        headerHeight: 60,
        rowHeight: 80,
        enableFilter: true,
        enableSorting: true,
        angularCompileRows: true
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

    $http.get("../../../sampleJson/SideChart.json").then(function (res) {
        $scope.exampleData = res.data;

    });

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

    $scope.BindPieChart = function () {
        debugger;
        var selectedItem = $scope.data;
        $http.get('../../../sampleJson/pieChart.json').
            success(function (data) {
                if (selectedItem == "")
                    $http.get('../../../sampleJson/pieChart.json').
                        success(function (data) {
                            for (var i = 0; i < data.length; i++) {
                                var value = 0;
                                Object.keys(data[i].y).forEach(function (name) {
                                    value += data[i].y[name];
                                });
                                data[i].y = value;
                            }
                            $scope.exampleData1 = data;
                        });
                else {
                    var dataArray = data;
                    for (var i = 0; i < data.length; i++) {
                        var v = data[i].y[selectedItem];
                        dataArray[i].y = v;
                    }
                    $scope.exampleData1 = dataArray; // data;
                }
            });
    };

    $http.get('../../../sampleJson/pieChart.json').
   success(function (data) {
       for (var i = 0; i < data.length; i++) {
           var value = 0;
           Object.keys(data[i].y).forEach(function (name) {
               value += data[i].y[name];
           });
           data[i].y = value;
       }
       $scope.exampleData1 = data;
   }).error(function () {
   });
    //$scope.exampleData1 = [
    //        {
    //            key: "< 5 Days",
    //            y: 5
    //        },
    //        {
    //            key: "6-10 Days",
    //            y: 2
    //        },
    //        {
    //            key: "11-20 Days",
    //            y: 9
    //        },
    //        {
    //            key: "20 Days +",
    //            y: 7
    //        }
    //];



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
    var colorArray = ['#fedf22', '#5b5b5d', '#909090', '#c5c5c5'];
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
app.directive('tabs', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: [
            "$scope", function ($scope) {
                var panes = $scope.panes = [];

                $scope.select = function (pane) {
                    angular.forEach(panes, function (pane) {
                        pane.selected = false;
                        
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
                '<a href="" ng-click="select(pane)"><i class="{{pane.icon}}"></i>' +
                '{{pane.title}}</a>' +
                '</li>' +
                '</ul>' +
                '<div class="tab-content" ng-transclude></div>' +
                '</div>',
        replace: true
    };
}).
    directive('pane', function () {
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

app.controller("ManagerDashboardCtrl", function ($scope, $http, $rootScope) {
    var columnDefs = [
        {
            headerName: "", field: "analystName", width: 95, suppressMenu: 'true', cellRenderer: upperCaseNewValueHandler,
            cellClass: 'rag-initial'
        },
        {
            headerName: "Analysts Name", field: "", sort: "asc", width: 250,
            cellRenderer: function (params) {
                return '<a href title="Click to change KPI Data" ng-click="$event.stopPropagation();BindAnalystCharts(' + params.data.id + ');">' + params.data.analystName + '</a>' + '-' + params.data.id;
            }
        },
        { headerName: "Open Items", field: "openCases", filter: 'number', width: 200 },
        { headerName: "Action", field: "action", suppressMenu: 'true', suppressSorting: 'true', suppressSizeToFit: 'true', width: 400, cellRenderer: actionHandler }
    ];

    $scope.BindAnalystCharts = function (analystId) {
        debugger;
        alert(analystId);
        var selectedItem = $scope.data;
        $http.get('../../../sampleJson/pieChart.json').
            success(function (data) {
                if (selectedItem == "")
                    $http.get('../../../sampleJson/pieChart.json').
                        success(function (data) {
                            for (var i = 0; i < data.length; i++) {
                                var value = 0;
                                Object.keys(data[i].y).forEach(function (name) {
                                    value += data[i].y[name];
                                });
                                data[i].y = value;
}
                            $scope.exampleData1 = data;
                        });
                        else {
                            var dataArray = data;
                    for (var i = 0; i < data.length; i++) {
                        var v = data[i].y[selectedItem];
                        dataArray[i].y = v;
                    }
                    $scope.exampleData1 = dataArray; // data;
                    }
            });
        };

    function upperCaseNewValueHandler(params) {
        var data = params.value.toUpperCase();
        var spl = data.split(' ');
        var finalVal = "";
        for (var i = 0; i < spl.length; i++) {
            if (i == 2) break;
            finalVal += spl[i].substr(0, 1);
        }
        return "<span>" + finalVal + "</span>";
    }
    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        enableFilter: true,
        enableSorting: true,
        headerRowHeight: 50,
        headerHeight: 60,
        rowHeight: 80
    };

    function actionHandler(params) {
        return "<span>Manage Items</span>";
    }

    //$scope.pieChart = "../pieChart/pieChartView.html";

    $http.get("../../../sampleJson/analystsCases.json")
        .then(function (res) {
            $scope.gridOptions.rowData = res.data;
            $scope.gridOptions.api.onNewRows();
        });

    var colorArray = ['#FF0000', '#0000FF', '#FFFF00', '#00FFFF'];
    $scope.colorFunction = function () {
        return function (d, i) {
            return colorArray[i];
        };
    }

    $scope.productionOutputData = [
                 {
                     "key": "Series 1",
                     "values": [[1025409600000, 0], [1028088000000, -6.3382185140371], [1030766400000, -5.9507873460847], [1033358400000, -11.569146943813], [1036040400000, -5.4767332317425], [1038632400000, 0.50794682203014], [1041310800000, -5.5310285460542], [1043989200000, -5.7838296963382], [1046408400000, -7.3249341615649], [1049086800000, -6.7078630712489], [1051675200000, 0.44227126150934], [1054353600000, 7.2481659343222], [1056945600000, 9.2512381306992]]
                 },
                 {
                     "key": "Series 2",
                     "values": [[1025409600000, 0], [1028088000000, 0], [1030766400000, 0], [1033358400000, 0], [1036040400000, 0], [1038632400000, 0], [1041310800000, 0], [1043989200000, 0], [1046408400000, 0], [1049086800000, 0], [1051675200000, 0], [1054353600000, 0], [1056945600000, 0], [1059624000000, 0], [1062302400000, 0], [1064894400000, 0], [1067576400000, 0], [1070168400000, 0], [1072846800000, 0], [1075525200000, -0.049184266875945]]
                 },
                {
                    "key": "Series 3",
                    "values": [[1025409600000, 0], [1028088000000, -6.3382185140371], [1030766400000, -5.9507873460847], [1033358400000, -11.569146943813], [1036040400000, -5.4767332317425], [1038632400000, 0.50794682203014], [1041310800000, -5.5310285460542], [1043989200000, -5.7838296963382], [1046408400000, -7.3249341615649], [1049086800000, -6.7078630712489], [1051675200000, 0.44227126150934], [1054353600000, 7.2481659343222], [1056945600000, 9.2512381306992]]
                },
                {
                    "key": "Series 4",
                    "values": [[1025409600000, -7.0674410638835], [1028088000000, -14.663359292964], [1030766400000, -14.104393060540], [1033358400000, -23.114477037218], [1036040400000, -16.774256687841], [1038632400000, -11.902028464000], [1041310800000, -16.883038668422], [1043989200000, -19.104223676831], [1046408400000, -20.420523282736], [1049086800000, -19.660555051587], [1051675200000, -13.106911231646], [1054353600000, -8.2448460302143], [1056945600000, -7.0313058730976]]
                }
    ];
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
