/// <reference path="../pieChart/pieChartView.html" />
/// <reference path="../pieChart/pieChartView.html" />
var module = angular.module("managerDashboard", ["angularGrid"]);//, "../../../assets/libs/Chart.js"]);


module.controller("managerDashboardController", function ($scope, $http) {

    var columnDefs = [
        {
            headerName: "ID", field: "id", hide:true
        },
        {
            headerName: "Analysts Name", field: "analystName",sort:"asc",
            cellRenderer: function (params) {
                return '<a href=# title="Click to change KPI Data">' + params.value + '</a>';
            }
        },
        { headerName: "Open Cases", field: "openCases", filter: 'number' },
        { headerName: "Action", field: "action", suppressMenu: 'true', suppressSorting: 'true', suppressSizeToFit:'true' }
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
});
