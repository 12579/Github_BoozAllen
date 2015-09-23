
(function () {
    'use strict';

    angular.module('riskCanvasApp')
    .controller('DdDashboardCtrl', ["$state", "$scope", "$stateParams", "$window", "$http", "authenticationSvc", "ShareData", "globals", function ($state, $scope, $stateParams, $window, $http, authenticationSvc, shareData, globals) {
        var userInfo = authenticationSvc.getUserInfo();
        $scope.userInfo = userInfo;
        $scope.shareData = shareData;

        $scope.gridFunction = function (id) {
            authenticationSvc.selectedGridID = id;
            $state.transitionTo('Home.entityDetail');
        }
        $scope.openOnboardReviews = function (id) {
            authenticationSvc.selectedGridID = id;
            $state.transitionTo('Home.reviewDetails');
        }

        $scope.openPeriodicReviews = function (id) {
            authenticationSvc.selectedGridID = id;
            $state.transitionTo('Home.reviewDetails');
        }
        
        var casecolumnDefs = [
            {
                headerName: "ID", field: "id", hide: true
            },
            {
                headerName: "ID", field: "accountType", hide: true
            },
            {
                headerName: "ID", field: "accountNumber", hide: true
            },
            {
                headerName: "", field: "entityName", width: 95 * globals.defaultVars.w / globals.defaultVars.winRef, suppressMenu: 'true', cellRenderer: upperCaseNewValueHandler,
                cellClass: 'rag-initial',
                cellClassRules: {
                    'rag-green': function (params) { return params.data.entityRiskScore < 33.334 },
                    'rag-amber': function (params) { return params.data.entityRiskScore >= 33.334 && params.data.entityRiskScore < 66.667 },
                    'rag-red': function (params) { return params.data.entityRiskScore >= 66.667 }
                }
            },
            {
                headerName: "", field: "", width: 300 * globals.defaultVars.w / globals.defaultVars.winRef, suppressMenu: 'true', cellClass: 'rag-entity', cellRenderer: function (params) {
                    return '<span><a style="cursor:pointer!important;" ng-click="gridFunction( ' + params.data.id + ')" > <b>' + params.data.entityName + '</b> -' + params.data.id + '</a><br />' + params.data.accountType + ' - ' + params.data.accountNumber + '</span>';

                    //<a ui-sref="home.entityDetail({id:' + params.data.id + '})" title="Click"></a>'
                }
            },
            {
                headerName: "RiskDNA",
                field: "entityRiskScore",
                width: 700 * globals.defaultVars.w / globals.defaultVars.winRef, filter: 'number',
                cellRenderer: riskDnaHandler,
                cellClass: 'rag-RiskDNA',
                cellClassRules: {
                    'rag-green': function (params) { return params.data.entityRiskScore < 33.334 },
                    'rag-amber': function (params) { return params.data.entityRiskScore >= 33.334 && params.data.entityRiskScore < 66.667 },
                    'rag-red': function (params) { return params.data.entityRiskScore >= 66.667 }
                }
            },
    {
        headerName: "Review Status", field: "caseStatus", width: 200* globals.defaultVars.w / globals.defaultVars.winRef, cellClass: 'rag-caseStatus',
        cellClassRules: {
            'type-new': function (params) { return params.data.caseStatus == 'New' },
            'type-dc': function (params) { return params.data.caseStatus == 'Data Collection' },
            'type-an': function (params) { return params.data.caseStatus == 'Analysis' },
            'type-qa': function (params) { return params.data.caseStatus == 'Q/A' },
            'type-aa': function (params) { return params.data.caseStatus == 'Awaiting Assignment' }
        }
    },
            { headerName: "Open Date", field: "caseOpenDate", width: 150* globals.defaultVars.w / globals.defaultVars.winRef, suppressMenu: 'true', comparator: dateComparator, filter: 'number' },
            { headerName: "Due Date", field: "caseDueDate", width: 170* globals.defaultVars.w / globals.defaultVars.winRef, suppressMenu: 'true', comparator: dateComparator, filter: 'number' },
        {
            headerName: "", field: "", suppressMenu: 'true', suppressSorting: 'true',
            suppressSizeToFit: 'true', cellRenderer: function (params) {
                return '<a class="clickButton" style="cursor:pointer!important;" ng-click="openOnboardReviews( ' + params.data.id + ')" >Open</a>';
            }
        }
        ];
        var alertcolumnDefs = [
            {
                headerName: "ID", field: "id", hide: true
            },
            {
                headerName: "ID", field: "accountType", hide: true
            },
            {
                headerName: "ID", field: "accountNumber", hide: true
            },
            {
                headerName: "", field: "entityName", width: 95* globals.defaultVars.w / globals.defaultVars.winRef, suppressMenu: 'true', cellRenderer: upperCaseNewValueHandler,
                cellClass: 'rag-initial',
                cellClassRules: {
                    'rag-green': function (params) { return params.data.entityRiskScore < 33.334 },
                    'rag-amber': function (params) { return params.data.entityRiskScore >= 33.334 && params.data.entityRiskScore < 66.667 },
                    'rag-red': function (params) { return params.data.entityRiskScore >= 66.667 }
                }
            },
            {
                headerName: "", field: "", width: 300 * globals.defaultVars.w / globals.defaultVars.winRef, suppressMenu: 'true', cellClass: 'rag-entity', cellRenderer: function (params) {
                    return '<span><a style="cursor:pointer!important;" ng-click="gridFunction( ' + params.data.id + ')" > <b>' + params.data.entityName + '</b> -' + params.data.id + '</a><br />' + params.data.accountType + ' - ' + params.data.accountNumber + '</span>';

                    //<a ui-sref="home.entityDetail({id:' + params.data.id + '})" title="Click"></a>'
                }
            },
            {
                headerName: "RiskDNA",
                field: "entityRiskScore",
                width: 700 * globals.defaultVars.w / globals.defaultVars.winRef, filter: 'number',
                cellRenderer: riskDnaHandler,
                cellClass: 'rag-RiskDNA',
                cellClassRules: {
                    'rag-green': function (params) { return params.data.entityRiskScore < 33.334 },
                    'rag-amber': function (params) { return params.data.entityRiskScore >= 33.334 && params.data.entityRiskScore < 66.667 },
                    'rag-red': function (params) { return params.data.entityRiskScore >= 66.667 }
                }

            },
            {
                headerName: "Review Status", field: "alertStatus", width: 200 * globals.defaultVars.w / globals.defaultVars.winRef, cellClass: 'rag-caseStatus',
                cellClassRules: {
                    'type-new': function (params) { return params.data.alertStatus == 'New' },
                    'type-dc': function (params) { return params.data.alertStatus == 'Data Collection' },
                    'type-an': function (params) { return params.data.alertStatus == 'Analysis' },
                    'type-qa': function (params) { return params.data.alertStatus == 'Q/A' },
                    'type-aa': function (params) { return params.data.alertStatus == 'Awaiting Assignment' }
                }
            },
            { headerName: "Open Date", field: "alertOpenDate", width: 150 * globals.defaultVars.w / globals.defaultVars.winRef, suppressMenu: 'true', comparator: dateComparator, filter: 'number' },
            { headerName: "Due Date", field: "alertDueDate", width: 170 * globals.defaultVars.w / globals.defaultVars.winRef, suppressMenu: 'true', comparator: dateComparator, filter: 'number' },
            {
                headerName: "", field: "", suppressMenu: 'true', suppressSorting: 'true',
                suppressSizeToFit: 'true', cellRenderer: function (params) {
                    return '<a class="clickButton" style="cursor:pointer!important;" ng-click="openPeriodicReviews( ' + params.data.id + ')" >Open</a>';
                }
            }
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

            var cellWidth = params.eGridCell.style.width;
            cellWidth = cellWidth.substring(0, cellWidth.length - 2);
            var cellwidthInt = parseInt(cellWidth);

            params.$scope.dnaData = params.data;
            var totalSequence = params.data.riskDNA.sequences.length;
            //var sequenceWidthMain = 700*defaultVars.w/defaultVars.winRef / totalSequence;
            var sequenceWidthMain = cellwidthInt * globals.defaultVars.w / globals.defaultVars.winRef / totalSequence;
            var sequenceWidth = sequenceWidthMain - 20 * globals.defaultVars.w / globals.defaultVars.winRef;
            params.$scope.SequenceWidth = sequenceWidth - 5;
            //+ '<div style="float: left; background-color: white; height: 1.47em;">&nbsp;</div>'
            //             style=" width:' + sequenceWidthMain + 'px"  
            var data =
                '<div class="riskData">'
                    + '<div style="float: left; width:{{SequenceWidth+5}}px;" ng-mouseover="showPopover()" ng-mouseleave="hidePopover()" ng-repeat="dna in dnaData.riskDNA.sequences">'

                        + '<div class="dataPopup" style="position: absolute; z-index: 100;" ng-show="popoverIsVisible">{{dna.sequenceType}}</div>'// : {{dna.sequenceScore|number:2}}
                            + '<div style="float: left; width:{{SequenceWidth/dna.genes.length}}px; border-left: 1px solid transparent; box-sizing: border-box; -ms-box-sizing: border-box; -moz-box-sizing: border-box; -webkit-box-sizing: border-box;"  ng-repeat="gene in dna.genes">'
                                + '<div ng-style="{\'border-left\': \'1px solid white\',\'background-color\': \'gray\',\'height\': \'1.47em\', \'float\':\'left; width:{{SequenceWidth/dna.genes.length}}px\'}" ng-mouseover="showPopoverGene()" ng-mouseleave="hidePopoverGene()" ng-show="gene.geneScore>=0 && gene.geneScore<33.33">&nbsp;</div>' //\'border-left\': \'1px solid white\',
                                + '<div ng-style="{\'border-left\': \'1px solid white\',\'background-color\': \'#f9db22\',\'height\': \'1.47em\', \'float\':\'left; width:{{SequenceWidth/dna.genes.length}}px\'}" ng-mouseover="showPopoverGene()" ng-mouseleave="hidePopoverGene()" ng-show="gene.geneScore>33.33 && gene.geneScore<66.66">&nbsp;</div>'//\'border-left\' : \'1px solid white\',
                                + '<div ng-style="{\'border-left\': \'1px solid white\',\'background-color\': \'red\',\'height\': \'1.47em\', \'float\':\'left; width:{{SequenceWidth/dna.genes.length}}px\'}" ng-mouseover="showPopoverGene()" ng-mouseleave="hidePopoverGene()" ng-show="gene.geneScore>66.66 && gene.geneScore<=100">&nbsp;</div>'//\'border-left\': \'1px solid white\',
                                + '<div class="dataPopdown" style="position: absolute;z-index: 100;" ng-show="popoverIsVisibleGene">{{gene.geneName}} | {{gene.geneValue}} | {{gene.geneScore}}</div>'
                            + '</div>'
                        + '</div>'

                        + '<div style="float: right;" class="dataNo">'
                            + '<div><span>{{data.entityRiskScore}}</span></div>'
                        + '</div>'
                    + '</div>';
            return data;
        }


        $scope.casegridOptions = {
            columnDefs: casecolumnDefs,
            rowData: null,
            headerHeight: 0.031 * angular.element(window).width(),
            rowHeight: 0.0416 * angular.element(window).width(),
            enableFilter: true,
            enableSorting: true,
            angularCompileRows: true
        };

        $scope.alertgridOptions = {
            columnDefs: alertcolumnDefs,
            rowData: null,
            headerHeight: 0.031 * angular.element(window).width(),
            rowHeight: 0.0416 * angular.element(window).width(),
            enableFilter: true,
            enableSorting: true,
            angularCompileRows: true
        };

        function loadAgingPieChart(data) {
            for (var i = 0; i < data.length; i++) {
                var value = 0;
                Object.keys(data[i].y).forEach(function (name) {
                    value += data[i].y[name];
                });
                data[i].y = value;
            }
            $scope.agingData = data;
            //            setTimeout(function () {
            //                var elems = angular.element('#exampleId2 .nv-legend .nv-series');
            //                if (!!!elems) {
            //                    var len = elems.length;
            //                    var val = angular.element(elems[len - 1]).attr('transform');
            //                    var numb = val.match(/\d/g);
            //                    numb = numb.join("");
            //                    numb = numb.substring(0, 3);
            //                    var xVal = parseInt(numb);
            //                    var yVal = 30;
            //                    for (var i = 0; i < len; i++) {
            //                        var elem = angular.element(elems)[i];
            //                        angular.element(elem).attr('transform', 'translate(' + xVal + ',' + yVal + ')');
            //                        yVal = yVal + 30;
            //                    }
            //                }
            //            }, 100);
        };

        $http.get("../../../sampleJson/dashboardJsonDd.json")
            .then(function (res) {

                $scope.alertgridOptions.rowData = res.data.alertData;
                $scope.alertgridOptions.api.onNewRows();
                $scope.totalAlertRows = res.data.alertData.length;
                $scope.shareData.alerts = res.data.alertData.length;

                $scope.casegridOptions.rowData = res.data.casesData;
                $scope.casegridOptions.api.onNewRows();
                $scope.totalCaseRows = res.data.casesData.length;
                $scope.shareData.cases = res.data.casesData.length;

                $scope.kpidashData = res.data.kpiChart;

                $scope.statusData = res.data.statusChart;

                $scope.agingPieChartData = angular.copy(res.data.pieChart);

                loadAgingPieChart(res.data.pieChart);



            });

        var colorArrayMain = ['#000000', '#5b5b5d', '#909090', '#c5c5c5'];
        $scope.colorFunctionMain = function () {
            return function (d, i) {
                return colorArrayMain[i];
            };
        }

        $scope.xFunctionSideChart = function () {
            return function (d) {
                return d[0];
            };
        }


        $scope.BindPieChart = function () {

            var selectedItem = $scope.data;
            var data = angular.copy($scope.agingPieChartData);
            if (selectedItem == "") {
                for (var i = 0; i < data.length; i++) {
                    var value = 0;
                    Object.keys(data[i].y).forEach(function (name) {
                        value += data[i].y[name];
                    });
                    data[i].y = value;
                }
                $scope.agingData = data;
            }
            else {
                var dataArray = data;
                for (var i = 0; i < data.length; i++) {
                    var v = data[i].y[selectedItem];
                    dataArray[i].y = v;
                }
                $scope.agingData = dataArray; // data;
            }

        };


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

        $scope.toolTipContentFunction = function () {
            return function (key, x, y, e, graph) {
                return '<b>' + key + '</b>';
            }
        }
        var colorArray = ['#f9db22', '#5b5b5d', '#909090', '#c5c5c5', '#FFE6E6'];
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
            var monthNumber = date.substring(0, 2);
            var dayNumber = date.substring(3, 5);

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
        $scope.showPopoverGene = function () {
            this.popoverIsVisibleGene = true;

        };
        $scope.hidePopoverGene = function () {
            this.popoverIsVisibleGene = false;
        };
    }
    ]);
})();