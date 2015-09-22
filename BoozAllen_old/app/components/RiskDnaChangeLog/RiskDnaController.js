(function () {
    'use strict';

    var app = angular.module('riskCanvasApp', ['ui.router', 'angularGrid', 'nvd3ChartDirectives']);

    app.service('ShareData', function () {
        return {};
    });

    app.service('authenticationSvc', function () {
        return {};
    });


    angular.module('riskCanvasApp')
    .controller('RiskDnaCtrl', ["$state", "$scope", "$stateParams", "$window", "$http", "authenticationSvc", "ShareData", function ($state, $scope, $stateParams, $window, $http, authenticationSvc, shareData) {
        //var userInfo = authenticationSvc.getUserInfo();
        //$scope.userInfo = userInfo;
        $scope.shareData = shareData;

        var changeLogColumnDefs = [
            { headerName: "ID", field: "id", hide: true },
            {
                headerName: "User", field: "", width: 300, suppressMenu: 'true', cellClass: 'rag-entity', cellRenderer: function (params) {
                    return '<span><b>' + params.data.userName + '</b> - ' + params.data.id + '</span>';
                }
            },
            { headerName: "Type", field: "type", width: 150 },
            { headerName: "Date", field: "date", width: 150, suppressMenu: 'true', comparator: dateComparator, sort:'asc' },
            { headerName: "Action", field: "action", width: 170, suppressMenu: 'true' }
        ];

        $scope.changeLogGridOptions = {
            columnDefs: changeLogColumnDefs,
            rowData: null,
            headerHeight: 50,//0.031 * angular.element(window).width(),
            rowHeight: 50,//0.0416 * angular.element(window).width(),
            enableFilter: true,
            enableSorting: true,
            angularCompileRows: true
        };


        $http.get("../../../sampleJson/personObject.json")
            .then(function (res) {
                $scope.changeLogGridOptions.rowData = res.data.changeLog;
                $scope.changeLogGridOptions.api.onNewRows();
                //$scope.riskDnaLog = res.data.statusChart;
                var riskDnaData = angular.copy(res.data.changeLog);

                var dnaData = [];
               

                for (var i = 0; i < riskDnaData.length; i++) {
                    var rowItemDetail = [];
                    rowItemDetail.push(Number(new Date(riskDnaData[i].date)));
                    rowItemDetail.push(riskDnaData[i].riskDnaScore);
                    dnaData.push(rowItemDetail);

                    rowItemDetail = [];
                    rowItemDetail.push(Number(new Date((new Date(riskDnaData[i].date)) + 10)));
                    rowItemDetail.push(riskDnaData[i].riskDnaScore + 10);
                    dnaData.push(rowItemDetail);

                    rowItemDetail = [];
                    rowItemDetail.push(Number(new Date((new Date(riskDnaData[i].date)) + 20)));
                    rowItemDetail.push(riskDnaData[i].riskDnaScore + 20);
                    dnaData.push(rowItemDetail);
                }
                var rowItemDetail = [];
                rowItemDetail.push(Number(new Date()));
                rowItemDetail.push(res.data.riskDNA.riskDnaScore);
                dnaData.push(rowItemDetail);
                $scope.riskDnaLog = [
                      {
                          "key": "riskDnaScore",
                          "bar": true,
                          "values": dnaData
                      }
                ];

                $scope.xAxisTickFormatFunction = function () {
                    return function (d) {
                        return d3.time.format('%x')(new Date(d));  //uncomment for date format
                    }
                }
               

                $scope.toolTipContentFunction = function () {
                    return function (key, x, y, e, graph) {
                        return '<p>' + y + '% at ' + x + '</p>';
                    }
                }

            });

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


    }
    ]);
})();