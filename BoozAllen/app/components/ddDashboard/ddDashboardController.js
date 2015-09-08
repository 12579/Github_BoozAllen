
(function () {
    'use strict';

    angular
        .module('myApp')
    .controller('DdDashboardCtrl', ["$state", "$scope", "$stateParams", "$window", "$http", "authenticationSvc", function ($state, $scope, $stateParams, $window, $http, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
        $scope.userInfo = userInfo;

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
                headerName: "", field: "", width: 300, suppressMenu: 'true', cellClass: 'rag-entity', cellRenderer: function (params) {
                    return '<span><b>' + params.data.entityName + '</b> -' + params.data.id + '<br />' + params.data.accountType + ' - ' + params.data.accountNumber + '</span>';
                }
            },
            {
                headerName: "RiskDNA",
                field: "riskDNA",
                width: 700,
                cellRenderer: riskDnaHandler,
                cellClass: 'rag-RiskDNA',
                cellClassRules: {
                    'rag-green': function (params) { return params.data.entityRiskScore < 33.334 },
                    'rag-amber': function (params) { return params.data.entityRiskScore >= 33.334 && params.data.entityRiskScore < 66.667 },
                    'rag-red': function (params) { return params.data.entityRiskScore >= 66.667 }
                }


            },
                //New	Data Collection	Analysis	Q/A
            {
                headerName: "Review Status", field: "caseStatus", width: 200, cellClass: 'rag-caseStatus',
                cellClassRules: {
                    'type-new': function (params) { return params.data.caseStatus == 'New' },
                    'type-dc': function (params) { return params.data.caseStatus == 'Data Collection' },
                    'type-an': function (params) { return params.data.caseStatus == 'Analysis' },
                    'type-qa': function (params) { return params.data.caseStatus == 'Quality Assurance' },
                    'type-aa': function (params) { return params.data.caseStatus == 'Awaiting Assignment' }
                }
            },
            { headerName: "Item Open Date", field: "caseOpenDate", width: 150, suppressMenu: 'true', comparator: dateComparator },
            { headerName: "Item Due Date", field: "caseDueDate", width: 170, comparator: dateComparator }
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
                headerName: "", field: "", width: 300, suppressMenu: 'true', cellClass: 'rag-entity', cellRenderer: function (params) {
                    return '<span><b>' + params.data.entityName + '</b> -' + params.data.id + '<br />' + params.data.accountType + ' - ' + params.data.accountNumber + '</span>';
                }
            },
            {
                headerName: "RiskDNA",
                field: "riskDNA",
                width: 700,
                cellRenderer: riskDnaHandler,
                cellClass: 'rag-RiskDNA',
                cellClassRules: {
                    'rag-green': function (params) { return params.data.entityRiskScore < 33.334 },
                    'rag-amber': function (params) { return params.data.entityRiskScore >= 33.334 && params.data.entityRiskScore < 66.667 },
                    'rag-red': function (params) { return params.data.entityRiskScore >= 66.667 }
                }

            },
            {
                headerName: "Review Status", field: "alertStatus", width: 200, cellClass: 'rag-caseStatus',
                cellClassRules: {
                    'type-new': function (params) { return params.data.alertStatus == 'New' },
                    'type-dc': function (params) { return params.data.alertStatus == 'Data Collection' },
                    'type-an': function (params) { return params.data.alertStatus == 'Analysis' },
                    'type-qa': function (params) { return params.data.alertStatus == 'Quality Assurance' },
                    'type-aa': function (params) { return params.data.alertStatus == 'Awaiting Assignment' }
                }
            },

            { headerName: "Item Open Date", field: "alertOpenDate", width: 150, suppressMenu: 'true', comparator: dateComparator },
            { headerName: "Item Due Date", field: "alertDueDate", width: 170, comparator: dateComparator }
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
        var smallColorArray = ['#f9db22', '#FFFFFF'];
        $scope.smallColorFunction = function () {
            return function (d, i) {
                return smallColorArray[i];
            };
        }

        function riskDnaHandler(params) {
            params.$scope.dnaData = params.data;
            var data =
                '<div style="padding-top: 27px;">'
                    + '<div style="float: left; width: 100px;" ng-mouseover="showPopover()" ng-mouseleave="hidePopover()" ng-repeat="dna in dnaData.riskDNA.sequences">'
                    + '<div style="float: left; background-color: white; height: 25px;">&nbsp;</div>'
                    + '<div class="popover" style="position: absolute;margin-top: -20px;z-index: 100;" ng-show="popoverIsVisible">{{dna.sequenceType}}</div>'
                    + '<div style="float: left;" ng-repeat="gene in dna.genes">'
                    + '<div ng-style="{\'border-left\': \'2px solid gray\',\'height\': \'25px\', \'float\':\'left\'}" ng-mouseover="showPopover1()" ng-mouseleave="hidePopover1()" ng-show="gene.geneScore>=0 && gene.geneScore<33.33">&nbsp;</div>'
                    + '<div ng-style="{\'border-left\' : \'2px solid yellow\',\'height\': \'25px\', \'float\':\'left\'}" ng-mouseover="showPopover1()" ng-mouseleave="hidePopover1()" ng-show="gene.geneScore>33.33 && gene.geneScore<66.66">&nbsp;</div>'
                    + '<div ng-style="{\'border-left\': \'2px solid red\',\'height\': \'25px\', \'float\':\'left\'}" ng-mouseover="showPopover1()" ng-mouseleave="hidePopover1()" ng-show="gene.geneScore>66.66 && gene.geneScore<=100">&nbsp;</div>'
                    + '<div class="popover1" style="position: absolute;margin-top: 20px;z-index: 100;" ng-show="popoverIsVisible1">{{gene.geneName}}</div>'
                    + '</div>'
                    + '</div>'
                    + '<div style="float: left; width: 100px;" class="dataNo">'
                    + '<div><span>{{data.entityRiskScore}}</span></div>'
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


        $http.get("../../../sampleJson/kpi.json").then(function (res) {

            $scope.kpidashData = res.data;

        });


        $http.get("../../../sampleJson/SideChart.json").then(function (res) {
            $scope.exampleData = res.data;

        });
        var colorArray1 = ['#f9db22', '#5b5b5d', '#909090', '#c5c5c5'];
        $scope.colorFunction1 = function () {
            return function (d, i) {
                return colorArray1[i];
            };
        }

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
            $http.get('../../../sampleJson/pieChartDd.json').
                success(function (data) {
                    if (selectedItem == "")
                        $http.get('../../../sampleJson/pieChartDd.json').
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

        $http.get('../../../sampleJson/pieChartDd.json').
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
        var colorArray = ['#fedf22', '#5b5b5d', '#909090', '#c5c5c5', '#FFE6E6'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
        }


        function monthToComparableNumber(date) {
            if (date === undefined || date === null || date.length !== 10) {
                return null;
            }

            var yearNumber = date.substring(6, 10);
            var monthNumber = date.substring(3, 5);
            var dayNumber = date.substring(0, 2);

            var result = (yearNumber * 10000) + (monthNumber * 100) + dayNumber;
            return result;
        }

        function dateComparator(date1, date2) {
            var date1Number = monthToComparableNumber(date1);
            var date2Number = monthToComparableNumber(date2);

            if (date1Number === null && date2Number === null) {
                return 0;
            }
            if (date1Number === null) {
                return -1;
            }
            if (date2Number === null) {
                return 1;
            }

            return date1Number - date2Number;
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

        $scope.showPopover = function () {

            this.popoverIsVisible = true;


        };
        $scope.hidePopover = function () {

            this.popoverIsVisible = false;

        };
        $scope.showPopover1 = function () {
            this.popoverIsVisible1 = true;

        };
        $scope.hidePopover1 = function () {
            this.popoverIsVisible1 = false;
        };
    }
    ]);
})();