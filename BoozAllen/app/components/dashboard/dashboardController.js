/// <reference path="../pieChart/pieChartView.html" />
/// <reference path="../pieChart/pieChartView.html" />
var module = angular.module("example", ["angularGrid"]);//, "../../../assets/libs/Chart.js"]);


module.controller("exampleCtrl", function ($scope, $http) {
    //, suppressMenu: 'true'
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

            cellStyle: function(params) {
                if (params.value < 33.334) {
                    return { color: 'green' };
                } else if (params.value >= 33.334 && params.value < 66.667) {
                    return { color: 'yellow' };
                }
                else if (params.value >=  66.667) {
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

    $scope.chartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        series: ['Foo', 'Baz', 'Bar'],
        data: [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90],
            [42, 17, 28, 73, 50, 12, 68]
        ]
    };
});

