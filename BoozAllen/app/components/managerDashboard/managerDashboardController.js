
(function () {
    'use strict';
    
    angular
        .module('myApp')
    .controller('ManagerDashboardCtrl', ["$state", "$scope", "$stateParams", "$window", "$http", "authenticationSvc", function ($state, $scope, $stateParams, $window, $http, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
        $scope.userInfo = userInfo;

        var columnDefs = [
            {
                headerName: "", field: "analystName", width: 95, suppressMenu: 'true', cellRenderer: upperCaseNewValueHandler,
                cellClass: 'rag-initial rag-green'
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
        function actionHandler(params) {
            return "<span>Manage Items</span>";
        }

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
            headerHeight: 60,
            rowHeight: 80,
            enableFilter: true,
            enableSorting: true,
            angularCompileRows: true
        };

        //$scope.pieChart = "../pieChart/pieChartView.html";

        $http.get("../../../sampleJson/analystsCases.json")
            .then(function (res) {
                $scope.gridOptions.rowData = res.data;
                $scope.gridOptions.api.onNewRows();
            });

        var colorArray = ['#fedf22', '#5b5b5d', '#909090', '#c5c5c5'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
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
        $scope.currentDate = new Date();
        $scope.productionOutputData = [
        {
                     "key": "Alerts",
                     "values": [[1, 12], [2, 2], [3, 3], [4, 4], [7, 1], [8, 2], [9, 3], [10, 4], [11, 5], [14, 2], [15, 3], [16, 1], [17, 1], [18, 2], [21, 5], [22, 1], [23, 1], [24, 2], [25, 3], [28, 1], [29, 4], [30, 5]]
                 },
                 {
                     "key": "Cases",
                     "values": [[1, 12], [2, 2], [3, 3], [4, 4], [7, 1], [8, 2], [9, 3], [10, 4], [11, 5], [14, 2], [15, 3], [16, 1], [17, 1], [18, 2], [21, 5], [22, 1], [23, 1], [24, 2], [25, 3], [28, 1], [29, 4], [30, 5]]
                     },
                {
                    "key": "Onboarding Reviews",
                    "values": [[1, 12], [2, 2], [3, 3], [4, 4], [7, 1], [8, 2], [9, 3], [10, 4], [11, 5], [14, 2], [15, 3], [16, 1], [17, 1], [18, 2], [21, 5], [22, 1], [23, 1], [24, 2], [25, 3], [28, 1], [29, 4], [30, 5]]
                },
                {
                    "key": "Periodic Reviews",
                    "values": [[1, 12], [2, 2], [3, 3], [4, 4], [7, 1], [8, 2], [9, 3], [10, 4], [11, 5], [14, 2], [15, 3], [16, 1], [17, 1], [18, 2], [21, 5], [22, 1], [23, 1], [24, 2], [25, 3], [28, 1], [29, 4], [30, 5]]
                }
                ];

        var colorArray = ['#fedf22', '#5b5b5d', '#909090', '#c5c5c5'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
        }

        $scope.showDates_mm_dd = function () {
            return function (d) {
                return d3.time.format('%m/%d')(new Date(d));
            }
        }
        $http.get("../../../sampleJson/ReviewbyStatus.json").then(function (res) {
            //alert("hi");
            $scope.statusData = res.data;

        });
        var colorArray7 = ['#f9db22', '#5b5b5d', '#909090', '#c5c5c5'];
        $scope.colorFunction7 = function () {
            return function (d, i) {
                return colorArray7[i];
            };
        }
        $http.get("../../../sampleJson/kpi.json").then(function (res) {

            $scope.kpiData = res.data;

        });

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
    }
    ]);
})();
