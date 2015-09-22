/// <reference path="../pieChart/pieChartView.html" />
/// <reference path="../pieChart/pieChartView.html" />
var module = angular.module("managerDashboard", ["angularGrid", 'nvd3ChartDirectives']);//, "../../../assets/libs/Chart.js"]);


module.controller("managerDashboardController", function ($scope, $http) {

    var columnDefs = [
        {
            headerName: "ID", field: "id", hide:true
        },
        {
            headerName: "Analysts Name", field: "analystName",sort:"asc",width:450,
            cellRenderer: function (params) {
                return '<a href=# title="Click to change KPI Data">' + params.value + '</a>';
            }
        },
        { headerName: "Open Cases", field: "openCases", filter: 'number', width: 200 },
        { headerName: "Action", field: "action", suppressMenu: 'true', suppressSorting: 'true', suppressSizeToFit: 'true', width: 450 }
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
