
(function () {
    'use strict';

    angular.module('riskCanvasApp')
    .controller('entityDetailCtrl', ["$state", "$scope", "$stateParams", "$window", "$http", "authenticationSvc", "ShareData", "VisDataSet", function ($state, $scope, $stateParams, $window, $http, authenticationSvc, shareData, VisDataSet) {

        var defaultVars = {
            w: angular.element(window).width(),
            winRef: 1920
        };
        $scope.slideToggleSec = function (element) {
            var elem = element.currentTarget;
            angular.element(elem).closest('article').find('.toggleSec').slideToggle();
            angular.element(elem).toggleClass('open');
        }
        $scope.addNewDocument = function (event, type) {
            angular.element('.addPopup[data-type=' + type + ']').fadeToggle();
            var elem = event.currentTarget;
            angular.element(elem).toggleClass('active');
        };
        $scope.closePopup = function () {
            angular.element('.addPopup').fadeOut();
        };
        $scope.cardNext = function () {

        };

        $scope.cardPrev = function () {

        };

        $http.get("../../../sampleJson/personObject.json")
            .then(function (res) {
                $scope.entityDetail = res.data.person;

                var negativeNewsData = res.data.person.eddPersonData.negativeNewsData.articles;
                var chartdata = bindAgingPieChart(negativeNewsData);

                $scope.agingData = chartdata;

                $scope.cardcount = res.data.person.personas.length;
                var cardcount = res.data.person.personas.length;
                var jsonObj = [];
                for (var i = 0; i < cardcount; i++) {
                    var data = res.data.person.personas[i];

                    var spl = data.names[0].split(' ');
                    var cardData = {};
                    cardData["name"] = data.names[0];
                    cardData["active"] = data.isActive;
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
                primaryData["shortname"] = res.data.person.personBaseData.firstName.substr(0, 1) + res.data.person.personBaseData.lastName.substr(0, 1);
                primaryData["score"] = res.data.person.riskDNA.riskDnaScore;

                $scope.primaryDatas = primaryData;
                $scope.cardDatas = jsonObj;

                //Risk dna overtime log
                var riskDnaData = angular.copy(res.data.history.events);
                var dnaData = [];
                var rowItemDetail;
                for (var i = 0; i < riskDnaData.length; i++) {
                    rowItemDetail = [];
                    rowItemDetail.push(Number(new Date(riskDnaData[i].eventDate)));
                    if (riskDnaData[i].snapshot.riskDNA === undefined) {
                        rowItemDetail.push(0);
                    } else {
                        rowItemDetail.push(riskDnaData[i].snapshot.riskDNA.riskDnaScore);
                    }
                    dnaData.push(rowItemDetail);
                }
                rowItemDetail = [];
                rowItemDetail.push(Number(new Date()));
                rowItemDetail.push(res.data.person.riskDNA.riskDnaScore);
                dnaData.push(rowItemDetail);
                $scope.riskDnaLog = [
                      {
                          "key": "riskDnaScore",
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

        function numberNewValueHandler(params) {
            var valueAsNumber = parseInt(params.newValue);
            if (isNaN(valueAsNumber)) {
                window.alert("Invalid value " + params.newValue + ", must be a number");
            } else {
                params.data.indicators.laundering = valueAsNumber;
                var data = $scope.negativeriskgridOptions.rowData;
                var chartdata = bindAgingPieChart(data);
                $scope.$watch('agingData', function (newValue, oldValue) {

                    $scope.agingData = chartdata;

                });
                $scope.$digest();


            }
        }

        var changeLogColumnDefs = [
           {
               headerName: "User", field: "", width: 950 * defaultVars.w / defaultVars.winRef, suppressMenu: 'true', cellClass: 'rag-entity', cellRenderer: function (params) {
                   return '<span><b>' + params.data.snapshot.personBaseData.firstName + ' ' + params.data.snapshot.personBaseData.lastName + '</b> - ' + params.data.snapshot.personBaseData.organizationID + '</span>';
               }
           },
           { headerName: "Type", field: "eventType", width: 300 * defaultVars.w / defaultVars.winRef },
           { headerName: "Date", field: "eventDate", width: 300 * defaultVars.w / defaultVars.winRef, suppressMenu: 'true', comparator: dateComparator, sort: 'asc' },
           { headerName: "Action", field: "eventAction", width: 200 * defaultVars.w / defaultVars.winRef, suppressMenu: 'true' }
        ];

        $scope.changeLogGridOptions = {
            columnDefs: changeLogColumnDefs,
            suppressHorizontalScroll: true,
            rowData: null,
            headerHeight: 40 * defaultVars.w / defaultVars.winRef,//0.031 * angular.element(window).width(),
            rowHeight: 70 * defaultVars.w / defaultVars.winRef,//0.0416 * angular.element(window).width(),
            enableFilter: true,
            enableSorting: true,
            angularCompileRows: true
        };


        var columnDefs = [
         {
             headerName: "", field: "", width: 520 * defaultVars.w / defaultVars.winRef, cellRenderer: function (params) {
                 return '<b>' + params.data.accountType.substr(0, 1).toUpperCase() + params.data.accountType.substr(1).toLowerCase() + ' Account</b><br/>' + 'Account Number - ' + params.data.accountNumber;
             }
         },
         {
             headerName: "", field: "", width: 200 * defaultVars.w / defaultVars.winRef, cellRenderer: function (params) {
                 return '<span><b>Personal Account</b></span>';
             }
         }
        ];
        var detailcolumnDefs = [
            { headerName: "Item ID", width: 200 * defaultVars.w / defaultVars.winRef, field: "itemID" },
            { headerName: "Item type", width: 400 * defaultVars.w / defaultVars.winRef, field: "itemType" },
            { headerName: "Item ", width: 250 * defaultVars.w / defaultVars.winRef, field: "item" },
            { headerName: "Account Number", width: 250 * defaultVars.w / defaultVars.winRef, field: "accountNumber" },
            { headerName: "Closed Date", width: 250 * defaultVars.w / defaultVars.winRef, field: "closedDate", comparator: dateComparator },
            { headerName: "Status", width: 250 * defaultVars.w / defaultVars.winRef, field: "status" },
            { headerName: "Assigned Analyst", width: 250 * defaultVars.w / defaultVars.winRef, field: "assignedAnalyst" }];

        var watchListGridColumnDefs = [
         {
             headerName: "Entity Name", width: 300 * defaultVars.w / defaultVars.winRef, field: "names", cellRenderer: upperCaseNewValueHandler, cellClass: 'rag-initial',
             cellClassRules: {
                 'rag-green': function (params) { return params.data.entityRiskScore < 33.334 },
                 'rag-amber': function (params) { return params.data.entityRiskScore >= 33.334 && params.data.entityRiskScore < 66.667 },
                 'rag-red': function (params) { return params.data.entityRiskScore >= 66.667 }
             }
         },
           { headerName: "Watchlist Provider", width: 240 * defaultVars.w / defaultVars.winRef, field: "watchlistProvider" },
           { headerName: "List Name ", width: 300 * defaultVars.w / defaultVars.winRef, field: "watchlistNames" },
           {
               headerName: "Ranking", width: 200 * defaultVars.w / defaultVars.winRef, field: "ranking", cellRenderer: function (params) {
                   return "StrengthIndex: " + params.data.ranking.StrengthIndex + "<br/>" + " ExposureIndex: " + params.data.ranking.ExposureIndex;
                   // return params.data.ranking;
               }
           }
        ];


        var pepHitsGridColumnDefs = [
            {
                headerName: "Entity Name",
                field: "entityName",
                width: 300 * defaultVars.w / defaultVars.winRef,
                cellRenderer: upperCaseNewValueHandler1,
                cellClass: 'rag-initial',
                cellClassRules: {
                    'rag-green': function (params) { return params.data.entityRiskScore < 33.334 },
                    'rag-amber': function (params) { return params.data.entityRiskScore >= 33.334 && params.data.entityRiskScore < 66.667 },
                    'rag-red': function (params) { return params.data.entityRiskScore >= 66.667 }
                }
            },
           { headerName: "PEP Provider", width: 210 * defaultVars.w / defaultVars.winRef, field: "PEP Provider" },
           { headerName: "PEP List", width: 190 * defaultVars.w / defaultVars.winRef, field: "PEP List" }
        ];

        var columnDefsnegativerisk = [
         {
             headerName: "Article Name", width: 300 * defaultVars.w / defaultVars.winRef, field: "title", suppressSorting: true
         },
         {
             headerName: "Adverse Keyword Hits", width: 300 * defaultVars.w / defaultVars.winRef, field: "text", suppressSorting: true
         },
         {
             headerName: "Date of Publication", width: 220 * defaultVars.w / defaultVars.winRef, field: "doa", suppressSorting: false, comparator: dateComparator
         },
         {
             headerName: "Risk Score", width: 150 * defaultVars.w / defaultVars.winRef, valueGetter: 'data.indicators.laundering', suppressSorting: false, editable: true, newValueHandler: numberNewValueHandler

         },
         {
             headerName: "Related Links", width: 200 * defaultVars.w / defaultVars.winRef, field: "url", suppressSorting: true
         }
        ];

        function upperCaseNewValueHandler(params) {
            var data = params.value[0].toUpperCase();
            var spl = data.split(',');
            var finalVal = "";
            for (var i = 0; i < spl.length; i++) {
                if (i == 2) break;
                finalVal += spl[i].trim().substr(0, 1);
            }
            return "<span>" + finalVal + "</span>" + params.value;
        }

        function upperCaseNewValueHandler1(params) {
            var data = params.value.toUpperCase();
            var spl = data.split(' ');
            var finalVal = "";
            for (var i = 0; i < spl.length; i++) {
                if (i == 2) break;
                finalVal += spl[i].substr(0, 1);
            }
            return "<span>" + finalVal + "</span>" + params.value;
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

        $scope.entityDetailOptions = {
            columnDefs: detailcolumnDefs,
            rowData: null,
            suppressHorizontalScroll: true,
            headerHeight: 60,
            rowHeight: 80,
            enableFilter: true,
            enableSorting: true,
            angularCompileRows: true
        };

        $scope.accountgridOptions = {
            columnDefs: columnDefs,
            suppressHorizontalScroll: true,
            rowData: null,
            headerHeight: 0,
            rowHeight: 80,
            angularCompileRows: true
        };

        $scope.watchListGridOptions = {
            columnDefs: watchListGridColumnDefs,
            rowData: null,
            suppressHorizontalScroll: true,
            headerHeight: 40 * defaultVars.w / defaultVars.winRef,
            rowHeight: 80 * defaultVars.w / defaultVars.winRef,
            enableSorting: true,
            angularCompileRows: true
        };

        $scope.pepHitsGridOptions = {
            columnDefs: pepHitsGridColumnDefs,
            rowData: null,
            suppressHorizontalScroll: true,
            headerHeight: 40 * defaultVars.w / defaultVars.winRef,
            rowHeight: 80 * defaultVars.w / defaultVars.winRef,
            enableSorting: true,
            angularCompileRows: true
        };

        $scope.negativeriskgridOptions = {
            columnDefs: columnDefsnegativerisk,
            rowData: null,
            suppressHorizontalScroll: true,
            headerHeight: 40 * defaultVars.w / defaultVars.winRef,
            rowHeight: 70 * defaultVars.w / defaultVars.winRef,
            enableSorting: true,
            angularCompileRows: true
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
        var colorArray = ['#fedf22', '#5b5b5d', '#909090', '#c5c5c5'];
        $scope.colorFunction = function () {
            return function (d, i) {
                return colorArray[i];
            };
        }
        var colorArrayRiskDna = ['#c5c5c5'];
        $scope.colorFunctionRiskDna = function () {
            return function (d, i) {
                return colorArrayRiskDna[i];
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

        /* Document, Notes, taks*/


        $scope.DownLoadFile = function () {
            if ($scope.FileData != undefined) {
                window.open($scope.FileData.data);
            }
        }

        $scope.DownloadFile = function (selectedRowID) {
            //  alert(selectedRowID);
        }

        $scope.downloadPdf = function () {
            if ($scope.FileData.data != undefined)
                $scope.$emit('downloaded', response.data);
        };

        var removeItemFromArray = function (array, value) {
            var index = array.indexOf(value);
            if (index == -1)
                array.push(value);
            else {
                if (array.length <= 0)
                    return array;
                array.splice(index, 1);
            }
            return array;
        }


        /*--------Common Function-----------------*/

        function IsValidateHandler(params) {
            var isValid = params.data.IsValidate;
            if (isValid) {
                return '<span>' + 'Yes' + '</span>';
            } else {
                return '<span>' + 'No' + '</span>';
            }
        }

        function DoumentCheckBoxHandler(params, idName) {
            var validID = params.data.ID;
            if (validID != undefined && validID != 0) {
                var value = idName + validID;
                if (idName == 'chkDocID')
                    return '<input type="checkbox" value=' + value + ' ng-click="DeleteDocument(' + params.data.ID + ')" />'; //"master" ng-click
                    //                else if (idName == 'chkNotesID')
                    //                    return '<input type="checkbox" value=' + value + ' ng-click="DeleteNotes(' + params.data.ID + ')" />';
                else if (idName == 'chkTasksGridID')
                    return '<input type="checkbox" value=' + value + ' ng-click="DeleteTasks(' + params.data.ID + ')" />';

            } else {
                return '<span></span>';
            }
        }

        /*--------Load DocumentCenterGrid-----------------*/
        $scope.DocumentIDArray = [];
        $scope.DeleteDocument = function (selectedID) {
            var array = $scope.DocumentIDArray;
            var outArray = removeItemFromArray(array, selectedID);
            $scope.DocumentIDArray = outArray;
            alert(selectedID);
        }

        $scope.RemoveDocument = function () {
            var selectedRowArray = $scope.DocumentIDArray;
            var notesGridArray = $scope.DocumentCenterGrid.rowData;

            var newArrayForDcoument = [];
            for (var i = 0; i < notesGridArray.length; i++) {
                var idVal = parseInt(notesGridArray[i].ID);
                var index = selectedRowArray.indexOf(idVal);
                if (index == -1)
                    newArrayForDcoument.push(notesGridArray[i]);
            }

            $scope.DocumentIDArray = [];
            $scope.DocumentCenterGrid.rowData = newArrayForDcoument;
            $scope.DocumentCenterGrid.api.onNewRows();
        }

        /* Form Submit Method */
        $scope.DocumentCenterGridUpload = function ($files, fileDesc) {
            var files = $files;
            if (files != null) {
                var type = files.type; //MIME type
                var size = files.size; //File size in bytes
                var name = files.name;
                var reader = new FileReader();
                reader.onload = function () {
                    var fileName = name;
                    var fileType = type;
                    var fileSize = size;
                    var fileData = reader.result;
                    var currentDate = new Date().toLocaleDateString();
                    var maxID = $scope.DocumentCenterGrid.rowData.length + 1;

                    var documentRecord = {
                        "ID": maxID,
                        "documentName": fileName,
                        "shortDescription": fileDesc,
                        "uploadedBy": userInfo.UserName,
                        "uploadDate": currentDate,
                        "lastUpdated": currentDate,
                        "validated": false,
                        "serializedContent": fileData
                    }
                    $scope.DocumentCenterGrid.rowData.push(documentRecord);
                    $scope.DocumentCenterGrid.api.onNewRows();
                    $files = null;
                    fileDesc = '';
                    $scope.picFile = '';
                    $scope.FileNameDesc = '';
                };
                reader.readAsDataURL(files, $scope.FileDesc);
            }
        };



        var documentCenterGridColumnDefs = [
               {
                   headerName: "FileName", field: "",
                   width: 290 * defaultVars.w / defaultVars.winRef,
                   suppressMenu: 'true',
                   cellClass: 'rag-entity',
                   cellRenderer: function (params) {
                       return '<span><b> <a ng-click="DownloadFile(' + params.data.documentName + ')"> ' + params.data.documentName + '</a> </b> <br />' + params.data.shortDescription + '-By ' + params.data.uploadedBy + '</span>';
                   }
               },
               {
                   headerName: "Upload Date",
                   width: 115 * defaultVars.w / defaultVars.winRef,
                   field: "uploadDate",
                   filter: 'date',

               },
               {
                   headerName: "Last Updated",
                   width: 115 * defaultVars.w / defaultVars.winRef,
                   field: "lastUpdated"
               },
               {
                   headerName: "Validated",
                   width: 115 * defaultVars.w / defaultVars.winRef,
                   field: "validated",
                   cellRenderer: function (params) { return IsValidateHandler(params) }
               }
               ,
            {
                headerName: "fileData",
                field: "serializedContent",
                hide: true
            }
        ];

        $scope.DocumentCenterGrid = {
            columnDefs: documentCenterGridColumnDefs,
            rowData: null,
            suppressHorizontalScroll: true,
            headerHeight: 50 * defaultVars.w / defaultVars.winRef,
            rowHeight: 60 * defaultVars.w / defaultVars.winRef,
            enableFilter: true,
            enableSorting: true,
            angularCompileRows: true,
            //rowSelection: 'multiple'
        };

        /*--------Load NotesGrid-----------------*/
        $scope.NotesIDArray = [];
        $scope.DeleteNotes = function (selectedID) {
            var array = $scope.NotesIDArray;
            var outArray = removeItemFromArray(array, selectedID);
            $scope.NotesIDArray = outArray;
            alert('DeleteNotes' + selectedID);
        }

        $scope.RemoveNotes = function () {
            var selectedRowArray = $scope.NotesIDArray;
            var notesGridArray = $scope.NotesGrid.rowData;

            var newArrayForNotes = [];
            for (var i = 0; i < notesGridArray.length; i++) {
                var idVal = parseInt(notesGridArray[i].ID);
                var index = selectedRowArray.indexOf(idVal);
                if (index == -1)
                    newArrayForNotes.push(notesGridArray[i]);
            }

            $scope.NotesIDArray = [];
            $scope.NotesGrid.rowData = newArrayForNotes;
            $scope.NotesGrid.api.onNewRows();
        }

        /* Form Submit Method */
        $scope.AddNotes = function (notesTitle, notesData) {
            var currentDate = new Date().toLocaleDateString();
            var maxID = $scope.NotesGrid.rowData.length + 1;
            var noteDesc = currentDate + " - By " + userInfo.UserName;

            var documentRecord = {
                "ID": maxID,
                "title": notesTitle,
                "notesData": noteDesc,
                "text": notesData,
                "createdDate": currentDate,
                "noteBy": userInfo.UserName
            }
            $scope.NotesGrid.rowData.push(documentRecord);
            $scope.NotesGrid.api.onNewRows();

            $scope.NotesTitle = '';
            $scope.NotesData = '';
        };

        function noteGridDesc(params) {
            var currentDate = new Date(params.data.createdDate).toLocaleTimeString();
            var noteDesc = currentDate + " - By " + params.data.userID;

            return '<span><b>' + params.data.title + '</b>  <br / > ' + noteDesc + ' <br / > <p>' + params.data.text + '</p> </span>';
        }

        var notesGridColumnDefs = [
               {
                   headerName: "",
                   width: 600 * defaultVars.w / defaultVars.winRef,
                   suppressMenu: 'true',
                   cellClass: 'rag-entity',
                   cellRenderer: function (params) {
                       return noteGridDesc(params);
                   }
               }
        ];

        $scope.NotesGrid = {
            columnDefs: notesGridColumnDefs,
            rowData: null,
            suppressHorizontalScroll: true,
            headerHeight: 0,
            rowHeight: 120 * defaultVars.w / defaultVars.winRef,
            enableFilter: true,
            enableSorting: true,
            angularCompileRows: true,
            //rowSelection: 'multiple'
        };

        /*--------Load TasksGrid-----------------*/
        $scope.TaskIDArray = [];
        $scope.DeleteTasks = function (selectedID) {
            var array = $scope.TaskIDArray;
            var outArray = removeItemFromArray(array, selectedID);
            $scope.TaskIDArray = outArray;
            alert('DeleteTasks' + selectedID);
        }

        $scope.RemoveTask = function () {
            var selectedRowArray = $scope.TaskIDArray;
            var taskGridArray = $scope.TasksGrid.rowData;
            var newArrayForTask = [];
            for (var i = 0; i < taskGridArray.length; i++) {
                var idVal = parseInt(taskGridArray[i].ID);
                var index = selectedRowArray.indexOf(idVal);
                if (index == -1)
                    newArrayForTask.push(taskGridArray[i]);
            }

            $scope.TaskIDArray = [];
            $scope.TasksGrid.rowData = newArrayForTask;
            $scope.TasksGrid.api.onNewRows();
        }

        /* Form Submit Method */
        $scope.AddTask = function (task) {
            var currentDate = new Date().toLocaleDateString();
            var maxID = $scope.TasksGrid.rowData.length + 1;

            var documentRecord = {
                "ID": maxID,
                task: task,
                taskDate: currentDate,
                order: 0,
                completed: false
            }
            $scope.TasksGrid.rowData.push(documentRecord);
            $scope.TasksGrid.api.onNewRows();

            $scope.Task = '';
        };

        function tasksGrid(params) {
            return '  <span class="taskRow"><b>' + params.data.task + '</b> </span>';
        }

        var tasksGridColumnDefs = [
            {
                headerName: "ID", field: "id", hide: true
            },
            { headerName: "order", field: "order", hide: true, sort: "desc" },

            {
                headerName: "",
                width: 500 * defaultVars.w / defaultVars.winRef,
                suppressMenu: 'true',
                cellClass: 'rag-entity',
                cellClassRules: {
                    'rag-done': function (params) { return params.data.completed === true },
                    'rag-open': function (params) { return params.data.completed === false }

                },
                cellRenderer: function (params) {
                    return tasksGrid(params);
                }
            },
            {
                headerName: "",
                suppressMenu: 'true',
                width: 100 * defaultVars.w / defaultVars.winRef,
                cellRenderer: function (params) { return DoumentCheckBoxHandler(params, 'chkTasksGridID'); }
            }
        ];

        $scope.TasksGrid = {
            columnDefs: tasksGridColumnDefs,
            rowData: null,
            suppressHorizontalScroll: true,
            headerHeight: 0,
            rowHeight: 40 * defaultVars.w / defaultVars.winRef,
            enableFilter: true,
            enableSorting: true,
            angularCompileRows: true,
            groupHeaders: false,
            //rowSelection: 'multiple'
        };

        $http.get("../../../sampleJson/personObject.json")
          .then(function (res) {
              var data = res.data.person;
              var transactionData = data.cddPersonData.activityCDD;


              //      "itemID": 12345678,
              //"itemType": "Auto Generated Structuring",
              //"item": "Alert",
              //"accountNumber": "1234567890",
              //"closedDate": "14-09-2015",
              //"status": "closed Esclation",
              //"assignedAnalyst": "Gary Charles"




              $scope.entityDetailOptions.rowData = [];
              $scope.entityDetailOptions.api.onNewRows();

              var negativeNewsData = res.data.person.eddPersonData.negativeNewsData.articles;
              for (var i = 0; i < negativeNewsData.length; i++) {
                  var doa = negativeNewsData[i].doa;
                  doa = dateformat(doa);
                  negativeNewsData[i].doa = doa;
                  //negativeNewsData[i].laundering = negativeNewsData[i].indicators.laundering;
              }

              $scope.negativeriskgridOptions.rowData = negativeNewsData;
              $scope.negativeriskgridOptions.api.onNewRows();

              $scope.accountgridOptions.rowData = res.data.person.cddPersonData.activityCDD.accounts;
              $scope.accountgridOptions.api.onNewRows();

              $scope.watchListGridOptions.rowData = res.data.person.cddPersonData.watchlistCDD.watchlistHits;
              $scope.watchListGridOptions.api.onNewRows();

              $scope.pepHitsGridOptions.rowData = res.data.person.cddPersonData.watchlistCDD.pepHits;
              $scope.pepHitsGridOptions.api.onNewRows();

              $scope.TasksGrid.rowData = res.data.tasks;
              $scope.TasksGrid.api.onNewRows();

              $scope.NotesGrid.rowData = res.data.notes;
              $scope.NotesGrid.api.onNewRows();

              $scope.DocumentCenterGrid.rowData = res.data.documents;
              $scope.DocumentCenterGrid.api.onNewRows();

              $scope.changeLogGridOptions.rowData = res.data.history.events;
              $scope.changeLogGridOptions.api.onNewRows();





              //Network Risk

              var LENGTH_MAIN = 50,
                  WIDTH_SCALE = 2,
                  GREEN = 'green',
                  RED = '#C5000B',
                  GRAY = 'gray',
                  BLACK = '#2B1B17',
                  WHITE = '#fff',
                  BLACK = 'black';

              var x = -350;
              var y = -250;
              var step = 100;

              var xHouse = -250;
              var yHouse = -200;

              var xCounter = 50;
              var yCounter = -200;

              var xFriend = -250;
              var yFriend = 200;

              var xColleauge = 50;
              var yColleauge = 200;

              var nodesData = [];
              var edgesData = [];
              var networkData = res.data.person.eddPersonData.networkData.nodes;
              $scope.relationship = ['Friends', 'Counterparties', 'Household', 'Colleague'];
              $scope.relations = ['Friends', 'Counterparties', 'Household', 'Colleague'];
              $scope.getRoles = function () {
                  return $scope.relationship;
              };
              $scope.firstData = true;
              $scope.check = function (value, checked) {
                  var idx = $scope.relationship.indexOf(value);
                  if (idx >= 0 && !checked) {
                      $scope.relationship.splice(idx, 1);
                  }
                  if (idx < 0 && checked) {
                      $scope.relationship.push(value);
                  }
                  var cnt = $scope.relationship.length;

                  var edgesData = angular.copy($scope.loadedges);
                  var nodesData = angular.copy($scope.loadnodes);
                  if (cnt === 4) {
                      $scope.firstData = true;
                  } else {
                      for (var i = 0, len = nodesData.length; i < len; i++) {
                          if ($scope.relationship.indexOf(nodesData[i].group) ===-1) {
                              nodesData.splice(i,1);
                              for (var j = 0, lenj = edgesData.length; j < lenj; j++) {
                                  if (edgesData[j].to === nodesData[i].id) {
                                      edgesData.splice(j, 1);
                                  } 
                              }
                          }
                      }
                      $scope.firstData = false;
                  }

                  //    $scope.loadedges = angular.copy(edgesData);
                  //$scope.loadnodes = angular.copy(nodesData);

                  var edges = VisDataSet(edgesData);
                  var nodes = VisDataSet(nodesData);

                  $scope.networkChartdata = {
                      nodes: nodes,
                      edges: edges
                  };
                  scope.$watch(networkChartdata);
              };

              var rowNodeDetail = {};
              var rowEdgeDetail = {};
              rowNodeDetail = {
                  id: 1, label: '', group: 'Primary', physics: false, title: res.data.person.personBaseData.firstName
              + ' ' + res.data.person.personBaseData.lastName
              };
              nodesData.push(rowNodeDetail);

              for (var iNetwork = 0; iNetwork < networkData.length; iNetwork++) {
                  rowNodeDetail = {};
                  if (networkData[iNetwork].relationship === 'Friends') {
                      xFriend = xFriend + step;
                      rowNodeDetail = {
                          id: iNetwork + 2,
                          x: xFriend,
                          y: yFriend,
                          label: '',
                          group: networkData[iNetwork].relationship,
                          physics: false,
                          title: networkData[iNetwork].label + '|' + networkData[iNetwork].source
                      };
                  }
                  else if (networkData[iNetwork].relationship === 'Counterparties') {
                      xCounter = xCounter + step;
                      rowNodeDetail = {
                          id: iNetwork + 2,
                          x: xCounter,
                          y: yCounter,
                          label: '',
                          group: networkData[iNetwork].relationship,
                          physics: false,
                          title: networkData[iNetwork].label + '|' + networkData[iNetwork].source
                      };
                  } else if (networkData[iNetwork].relationship === 'Household') {
                      xHouse = xHouse + step;
                      rowNodeDetail = {
                          id: iNetwork + 2,
                          x: xHouse,
                          y: yHouse,
                          label: '',
                          group: networkData[iNetwork].relationship,
                          physics: false,
                          title: networkData[iNetwork].label + '|' + networkData[iNetwork].source
                      };
                  } else if (networkData[iNetwork].relationship === 'Colleague') {
                      xColleauge = xColleauge + step;
                      rowNodeDetail = {
                          id: iNetwork + 2,
                          x: xColleauge,
                          y: yColleauge,
                          label: '',
                          group: networkData[iNetwork].relationship,
                          physics: false,
                          title: networkData[iNetwork].label + '|' + networkData[iNetwork].source
                      };
                  }

                  nodesData.push(rowNodeDetail);

                  var colorStrength = networkData[iNetwork].attributes.confidenceScore / 10;
                  var colorCode = networkData[iNetwork].attributes.confidenceScore < 33.34 ? RED : (networkData[iNetwork].attributes.confidenceScore > 66.67 ? GREEN : GRAY);

                  rowEdgeDetail = {
                      from: 1, to: iNetwork + 2, length: LENGTH_MAIN, width: WIDTH_SCALE * colorStrength, color: colorCode
                  };
                  edgesData.push(rowEdgeDetail);
              }

              $scope.loadedges = angular.copy(edgesData);
              $scope.loadnodes = angular.copy(nodesData);

              var edges = VisDataSet(edgesData);
              var nodes = VisDataSet(nodesData);

              $scope.networkChartdata = {
                  nodes: nodes,
                  edges: edges
              };

              $scope.networkChartOptions = {
                  layout: {
                      randomSeed: undefined,
                      improvedLayout: true,
                      hierarchical: {
                          enabled: false
                      }
                  },
                  height: '800',
                  width: '200%',
                  groups: {
                      Primary: {
                          image: '../../../assets/img/icon11.png',
                          shape: 'circularImage',

                          color: {
                              background: WHITE,
                              border: BLACK
                          },
                          fixed: {
                              x: true,
                              y: true
                          }

                      },
                      Household: {
                          image: '../../../assets/img/icon7.png',
                          shape: 'circularImage',

                          color: {
                              background: WHITE,
                              border: BLACK
                          },
                          fixed: {
                              x: true,
                              y: true
                          }

                      },
                      Counterparties: {
                          image: '../../../assets/img/icon10.png',
                          shape: 'circularImage',

                          color: {
                              background: WHITE,
                              border: BLACK
                          },
                          fixed: {
                              x: true,
                              y: true
                          }
                      },
                      Friends: {
                          image: '../../../assets/img/icon9.png',
                          shape: 'circularImage',

                          color: {
                              background: WHITE,
                              border: BLACK
                          },
                          fixed: {
                              x: true,
                              y: true
                          }
                      },
                      Colleague: {
                          image: '../../../assets/img/icon8.png',
                          shape: 'circularImage',
                          color: {
                              background: WHITE,
                              border: BLACK
                          },
                          fixed: {
                              x: true,
                              y: true
                          }
                      }
                  }
              };
          });


    }
    ]);
})();
