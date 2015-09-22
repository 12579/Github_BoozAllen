var app = angular.module('cardApp', ['angularGrid', 'nvd3ChartDirectives']).controller('cardCtrl',
    function cardCtrl($scope, $http) {
        var columnDefsnegativerisk = [
         {
             headerName: "Article Name", field: "title", suppressSorting: true
         },
         {
             headerName: "Adverse Keyword Hits", field: "text", suppressSorting: true
         },
         {
             headerName: "Date of Publication", field: "doa", suppressSorting: false, comparator: dateComparator

         },
         {
             headerName: "Risk Score", valueGetter: 'data.indicators.laundering', suppressSorting: false, editable: true, newValueHandler: numberNewValueHandler

         },
         {
             headerName: "Related Links", field: "url", suppressSorting: true
         }
        ];
        var columnDefs = [
         {
             headerName: "Associated accounts", field: "", width: 200, cellRenderer: function (params) {
                 return '<span><b>' + params.data.accountType.substr(0, 1).toUpperCase() + params.data.accountType.substr(1).toLowerCase() + ' Account</b><br />' + 'Account Number - ' + params.data.accountNumber + '</span>';
             }
         },
         {
             headerName: "Association", field: "", width: 150, cellRenderer: function (params) {
                 return '<span><b>Personal Account</b></span>';
             }
         }
        ];
        $scope.accountgridOptions = {
            columnDefs: columnDefs,
            rowData: null,
            angularCompileRows: true,
            headerHeight:0
        };
        $scope.negativeriskgridOptions = {
            columnDefs: columnDefsnegativerisk,
            rowData: null,
            enableSorting: true,
            angularCompileRows: true
        };
       
        var colorArray = ['#fedf22', '#5b5b5d', '#909090', '#c5c5c5'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
        }
        $scope.toolTipContentFunction1 = function () {
            return function (key) {
                return '<b>' + key + '</b>';
            }
        }

        function index(myArray, value) {
            var i;
            for (i = 0; i < myArray.length; i++) {
                if (myArray[i].key === value) {
                    return i;
                }
            }

        }

        function dateformat(doa) {
            var splitcol = doa.split(' ');
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var month = (months.indexOf(splitcol[0]) + 1);
            if (month < 10) {
                month = '0' + month;
            }
            var date = splitcol[1].replace(',', '');
            if (date < 10) {
                date = '0' + date;
            }
            return month + "/" + date + "/" + splitcol[2];
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
        
        $http.get("../../../sampleJson/person.json").then(function (res) {

            $scope.entityData = res.data;

            var cardcount = res.data.personas.length;
            var jsonObj = [];
            for (var i = 0; i < cardcount; i++) {
                var data = res.data.personas[i];

                var spl = data.names[0].split(' ');
                var cardData = {};
                cardData["name"] = data.names[0];
                cardData["active"] = data.isActive;
                cardData["new"] = data.isNew;
                var finalVal = "";
                for (var j = 0; j < spl.length; j++) {
                    if (j == 2) break;
                    finalVal += spl[j].substr(0, 1);

                }
                cardData["phone"] = data.phones[0].phoneNumber;
                cardData["email"] = data.emails[0].emailAddress;
                cardData["address"] = data.addresses[0];
                cardData["shortname"] = finalVal;
                cardData["score"] = data.matchScore;
                jsonObj.push(cardData);
            }

            var primaryData = {};
            primaryData["shortname"] = res.data.personBaseData.firstName.substr(0, 1) + res.data.personBaseData.lastName.substr(0, 1);
            primaryData["score"] = res.data.riskDNA.riskDnaScore;
            primaryData["risktype"] = res.data.riskDNA.riskDnaScore <= 33.33 ? 'LOW RISK' : res.data.riskDNA.riskDnaScore > 33.33 && res.data.riskDNA.riskDnaScore <= 66.66 ? 'MEDIUM RISK' : 'HIGH RISK';
            $scope.primaryDatas = primaryData;
            $scope.cardDatas = jsonObj;

            $scope.accountgridOptions.rowData = res.data.cddPersonData.activityCDD.accounts;
            $scope.accountgridOptions.api.onNewRows();

            
            var data = res.data.eddPersonData.negativeNewsData.articles;
            var chartdata= bindAgingPieChart(data);

            $scope.agingData = chartdata; 

            var data1 = res.data.eddPersonData.negativeNewsData.articles;
            for (var i = 0; i < data1.length; i++) {
                var doa = data1[i].doa;
                doa = dateformat(doa);
                data1[i].doa = doa;
             }

            $scope.negativeriskgridOptions.rowData = data1;
            $scope.negativeriskgridOptions.api.onNewRows();

            
        });
        function numberNewValueHandler(params) {
            var valueAsNumber = parseInt(params.newValue);
            if (isNaN(valueAsNumber)) {
                window.alert("Invalid value " + params.newValue + ", must be a number");
            } else {
                params.data.indicators.laundering = valueAsNumber;
                var data = $scope.negativeriskgridOptions.rowData;
                var chartdata = bindAgingPieChart(data);

                refresh(chartdata);

            }
        }

        function refresh(chartdata) {
           
            $scope.$apply(function () {
                $scope.agingData = chartdata;
            });
        }


        function bindAgingPieChart(data) {
            var chartData = [];

            for (var i = 0; i < data.length; i++) {
                var indexVal = index(chartData, data[i].text);
                if (indexVal != undefined) {
                    var launderingVal = chartData[indexVal].y;
                    launderingVal = launderingVal + data[i].indicators.laundering;
                    chartData[indexVal].y = launderingVal;
                } else {
                    var json = {};
                    json["key"] = data[i].text;
                    json["y"] = data[i].indicators.laundering;
                    chartData.push(json);
                }
            }

            return chartData;
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
     
    }
);