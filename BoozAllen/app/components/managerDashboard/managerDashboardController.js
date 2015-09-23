(function () {
    'use strict';

    angular.module('riskCanvasApp').controller('ManagerDashboardCtrl',
    [
        "$state", "$scope", "$stateParams", "$window", "$http", "authenticationSvc", "globals",
        function ($state, $scope, $stateParams, $window, $http, authenticationSvc, globals) {

            var userInfo = authenticationSvc.getUserInfo();
            $scope.userInfo = userInfo;

            function agingPieChart(data) {
                for (var i = 0; i < data.length; i++) {
                    var value = 0;
                    Object.keys(data[i].y).forEach(function (name) {
                        value += data[i].y[name];
                    });
                    data[i].y = value;
                }
                $scope.agingData = data;
            };

            function assignedDataPieChart(data, user) {

                var value = 0;
                Object.keys(data).forEach(function (name) {
                    value += data[name];
                });

                var jsonObj = [];
                var chartData = {};
                chartData["key"] = user;
                chartData["y"] = value;
                jsonObj.push(chartData);
                $scope.assignedData = jsonObj;
            };

            function upperCaseNewValueHandler(params) {
                var data = params.value.toUpperCase();
                var spl = data.split(' ');
                var finalVal = "";
                for (var i = 0; i < spl.length; i++) {
                    if (i === 2) break;
                    finalVal += spl[i].substr(0, 1);
                }
                return "<span>" + finalVal + "</span>";
            }

            function actionHandler() {
                return "<span class='clickButton'>Manage Items</span>";
            }

            function loadManagerCaseData(managerData) {

                $scope.productionOutputData = managerData.productionOutputData;

                $scope.agingPieChartData = angular.copy(managerData.pieChartData);
                agingPieChart(managerData.pieChartData);

                $scope.statusData = managerData.ReviewStatusData;
                $scope.kpiData = managerData.kpiChart;

                $scope.originalAssignedData = angular.copy(managerData.assignedData);
                var assignedData = managerData.assignedData;
                for (var i = 0; i < assignedData.length; i++) {
                    var value = 0;
                    Object.keys(assignedData[i].y).forEach(function (name) {
                        value += assignedData[i].y[name];
                    });
                    assignedData[i].y = value;
                }
                $scope.assignedData = assignedData;
            }

            function load() {

                $http.get("../../../sampleJson/analystsCases.json")
                    .then(function (res) {
                        loadManagerCaseData(res.data);

                        $scope.gridOptions.rowData = res.data.analysts;
                        $scope.gridOptions.api.onNewRows();
                    });
            }

            load();

            $scope.Refresh = function () {
                $scope.analystname = null;
                load();
            };

            $scope.bindAnalystCharts = function (selectdAnalystId) {
                var i;
                var data = angular.copy($scope.gridOptions.rowData);
                for (i = 0; i < data.length; i++) {
                    if (data[i].id === selectdAnalystId) {

                        $scope.productionOutputData = data[i].productionOutputData;

                        $scope.agingPieChartData = angular.copy(data[i].pieChartData);
                        agingPieChart(data[i].pieChartData);

                        $scope.statusData = data[i].ReviewStatusData;
                        $scope.kpiData = data[i].kpiChart;

                        $scope.originalAssignedData = angular.copy(data[i].assignedData);
                        assignedDataPieChart(data[i].assignedData, data[i].analystName);

                        $scope.analystname = data[i].analystName;
                    }
                }
            };

            $scope.BindAssignedData = function () {
                var selectedItem1 = $scope.singleSelect;
                var data = angular.copy($scope.originalAssignedData);
                var i;
                if (selectedItem1 === "") {
                    for (i = 0; i < data.length; i++) {
                        var value = 0;
                        Object.keys(data[i].y).forEach(function (name) {
                            value += data[i].y[name];
                        });
                        data[i].y = value;
                    }
                    $scope.assignedData = data;
                } else {
                    var dataArray = data;
                    for (i = 0; i < data.length; i++) {
                        var v = data[i].y[selectedItem1];
                        dataArray[i].y = v;
                    }
                    $scope.assignedData = dataArray;
                }
            };

            $scope.BindPieChart = function () {

                var selectedItem = $scope.data;
                var data = angular.copy($scope.agingPieChartData);
                var i;
                if (selectedItem === "") {
                    for (i = 0; i < data.length; i++) {
                        var value = 0;
                        Object.keys(data[i].y).forEach(function (name) {
                            value += data[i].y[name];
                        });
                        data[i].y = value;
                    }
                    $scope.agingData = data;
                } else {
                    var dataArray = data;
                    for (i = 0; i < data.length; i++) {
                        var v = data[i].y[selectedItem];
                        dataArray[i].y = v;
                    }
                    $scope.agingData = dataArray;
                }

            };

            $scope.currentDate = new Date();

            $scope.toolTipContentFunction = function () {
                return function (key, x) {
                    return '<b>' + x + '</b>';
                }
            }

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
                return function (key) {
                    return '<b>' + key + '</b>';
                }
            }

            var columnDefs = [
                {
                    headerName: "",
                    field: "analystName",
                    width: 95 * globals.defaultVars.w / globals.defaultVars.winRef,
                    suppressMenu: 'true',
                    cellRenderer: upperCaseNewValueHandler,
                    cellClass: 'rag-initial rag-green'
                },
                {
                    headerName: "Analyst",
                    field: "analystName",
                    sort: "asc",
                    width: 500 * globals.defaultVars.w / globals.defaultVars.winRef,
                    cellRenderer: function (params) {
                        return '<a href title="Click to change KPI Data" ng-click="bindAnalystCharts(' + params.data.id + ');">'
                            + params.data.analystName + '</a>' + '-' + params.data.id;
                    }
                },

                { headerName: "Assigned Items", field: "openCases", filter: 'number', width: 250 * globals.defaultVars.w / globals.defaultVars.winRef },
                {
                    headerName: "Action", field: "action", suppressMenu: 'true', suppressSorting: 'true',
                    suppressSizeToFit: 'true', width: 200 * globals.defaultVars.w / globals.defaultVars.winRef, cellRenderer: actionHandler
                }
            ];

            $scope.gridOptions = {
                columnDefs: columnDefs,
                rowData: null,
                headerHeight: .031 * angular.element(window).width(),
                rowHeight: 0.0416 * angular.element(window).width(),
                enableFilter: true,
                enableSorting: true,
                angularCompileRows: true
            };


            var colorArrayMain = ['#000000', '#5b5b5d', '#909090', '#c5c5c5'];
            $scope.colorFunctionMain = function () {
                return function (d, i) {
                    return colorArrayMain[i];
                };
            }
            var colorArray = ['#f9db22', '#5b5b5d', '#909090', '#c5c5c5'];
            $scope.colorFunction = function () {
                return function (d, i) {
                    return colorArray[i];
                };
            }
        }
    ]);

})();


