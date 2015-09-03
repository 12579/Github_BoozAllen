app.controller("DashboardController", function ($scope, $http, $rootScope) {
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