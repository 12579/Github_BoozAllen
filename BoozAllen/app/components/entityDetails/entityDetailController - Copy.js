
(function () {
    'use strict';

    angular.module('riskCanvasApp')
        .controller('entityDetailCtrl', [
            "$state", "$scope", "$stateParams", "$window", "$http", "authenticationSvc", "ShareData", "VisDataSet", "globals",
            function ($state, $scope, $stateParams, $window, $http, authenticationSvc, shareData, visDataSet, globals) {

                //TODO:use this id to filter records from person json
                $scope.selectedEntityId = authenticationSvc.selectedGridID;

                var colorArray = ['#fedf22', '#5b5b5d', '#909090', '#c5c5c5'];
                $scope.colorFunction = function () {
                    return function (d, i) {
                        return colorArray[i];
                    };
                }

                var colorArrayRiskDna = ['#000'];
                $scope.colorFunctionRiskDna = function () {
                    return function (d, i) {
                        return colorArrayRiskDna[i];
                    };
                }

                angular.element('.entityCard.active').index() === 0 ?
                angular.element('.cardNav .cardPrev').hide() : angular.element('.cardNav .cardPrev').show();

                //Entity tabs Risk dna 
                $scope.sequenceWidth = angular.element('.entityRiskTabs .nav-tabs').outerWidth() * 0.9 / 5;

                var resetCards = function () {
                    var items = angular.element('.entityCard');
                    var noOtItems = items.length;

                    if (items.length > 0)
                        angular.element(items[0]).addClass('active');

                    for (var i = 0; i < noOtItems; i++) {
                        items[i].style[globals.defaultVars.getVendor.js + "Transform"] = '';
                        items[i].style.opacity = '';
                        items[i].style.visibility = '';
                    }
                }

                $scope.cardNext = function () {
                    var items = angular.element('.entityCard'),
                        noOtItems = items.length,
                        y = 2,
                        z = 1.1,
                        current = document.querySelector('.entityCard.active');

                    for (var i = angular.element(current).index() ; i < noOtItems; i++) {
                        items[i].style[globals.defaultVars.getVendor.js + "Transform"] = 'translateY(' + y + 'em) scale(' + z + ')';
                        y = y - 2;
                        z = z - 0.1;
                    }
                    current.style.opacity = '0';
                    current.style.visibility = 'hidden';
                    angular.element(current).removeClass('active');
                    angular.element(current).next().addClass('active');
                    angular.element(current).next().hasClass('secCardWhite') ? angular.element('.cardNav').addClass('whiteActive') : angular.element('.cardNav').removeClass('whiteActive');
                    angular.element(current).next().index() === (noOtItems - 1) ? angular.element('.cardNav .cardNext').hide() : angular.element('.cardNav .cardNext').show();
                    angular.element('.cardNav .cardPrev').show();
                };

                $scope.cardPrev = function () {
                    var items = angular.element('.entityCard'),
                        noOtItems = items.length,
                        y = 0,
                        z = 1,
                        current = document.querySelector('.entityCard.active');

                    for (var i = angular.element(current).index() - 1; i < noOtItems; i++) {
                        items[i].style[globals.defaultVars.getVendor.js + "Transform"] = 'translateY(' + y + 'em) scale(' + z + ')';
                        y = y - 2;
                        z = z - 0.1;
                    }
                    angular.element(current).removeClass('active');
                    angular.element(current).prev().css('opacity', '1');
                    angular.element(current).prev().css('visibility', 'visible');
                    //            current.previousSibling.style.opacity = '1';
                    angular.element(current).prev().addClass('active');
                    angular.element(current).prev().hasClass('secCardWhite') ? angular.element('.cardNav').addClass('whiteActive') : angular.element('.cardNav').removeClass('whiteActive');
                    angular.element(current).prev().index() === 0 ? angular.element('.cardNav .cardPrev').hide() : angular.element('.cardNav .cardPrev').show();
                    angular.element('.cardNav .cardNext').show();
                };

                $scope.slideToggleSec = function (element) {
                    var elem = element.currentTarget;
                    angular.element(elem).closest('article').find('.toggleSec').slideToggle();
                    angular.element(elem).toggleClass('open');
                }

                $scope.openAddPopup = function (event, type) {
                    angular.element('.addPopup[data-type=' + type + ']').fadeToggle();
                    var elem = event.currentTarget;
                    angular.element(elem).toggleClass('active');
                };

                $scope.closePopup = function () {
                    angular.element('.addPopup').fadeOut();
                    angular.element('.docsFooter a').removeClass('active');

                    jQuery("#FileDesc").val('');
                    jQuery("#picFile").val('');
                    $scope.IsFileSelected = false;

                    jQuery("#NotesTitle").val('');
                    jQuery("#NotesData").val('');

                    jQuery("#Task").val('');
                    $scope.notesGridCellClicked = false;

                };

                $scope.addNewPersonas = function (event) {
                    $scope.IdType = [{ type: "SSN" }, { type: "Passport" }];
                    $scope.Country = [{ Key: "USA" }];
                    angular.element('.addNewCardWin').fadeIn();
                    var elem = event.currentTarget;
                    angular.element(elem).toggleClass('active');
                };

                $scope.closePersonaPopup = function () {
                    $scope.PersonaForm.$setPristine();
                    angular.element('.addNewCardWin').fadeOut('fast');
                    $scope.personaId = null;
                    $scope.personaIdType = null;
                    $scope.personaFirstName = null;
                    $scope.personaLastName = null;
                    $scope.personaStreet1 = null;
                    $scope.personaStreet2 = null;
                    $scope.personaCity = null;
                    $scope.personaState = null;
                    $scope.personaZipCode = null;
                    $scope.personaCountry = null;
                    $scope.personaPhoneNo = null;
                    $scope.personaEmail = null;
                };

                $scope.NegativeNewsDataPopup = function (title) {
                    title = title.trim();

                    var notesGridArray = $scope.negativeRiskGridOptions.rowData;

                    for (var i = 0; i < notesGridArray.length; i++) {
                        var idVal = notesGridArray[i].title;

                        if (title === idVal) {
                            var record = notesGridArray[i];
                            $scope.negtitle = record.title;
                            //alert(record.title);
                            jQuery("#negativeNewsRiskHeaderTitle").html("<h2>" + record.title + "</h2>");
                            jQuery("#negativeNewsRiskUrl").html('Source: ' + record.url);
                            jQuery("#negativeNewsRiskDoa").html('Date: ' + record.doa);
                            jQuery("#negativeNewsRiskTitle").html("<h3>" + record.title + "</h3>");
                            jQuery("#negativeNewsRiskText").html(record.text);

                            break;
                        }
                    }


                    angular.element('.addPopup[data-type=negativeNewsRisk]').fadeToggle();
                };

                setTimeout(function () {
                    var dna = angular.element('.riskData');
                    //  tabs = angular.element('.entityRiskTabs .nav-tabs li'),
                    // index = 0;
                    angular.element.each(dna, function (index) {
                        var elem = angular.element('.entityRiskTabs .nav-tabs li')[index];
                        angular.element(elem).append(dna[index]);
                    });
                }, 100);

                function index(myArray, value) {
                    var i;
                    for (i = 0; i < myArray.length; i++) {
                        if (myArray[i].key === value) {
                            return i;
                        }
                    }
                    return undefined;
                }

                function getContentType(fileExtention) {
                    var contentType = "";
                    switch (fileExtention) {
                        case "pdf":
                            contentType = 'data: application / pdf; base64,';
                            break;
                        case "csv":
                            contentType = 'data:application/vnd.ms-excel;base64,' + response.serializedContent;
                            break;
                        case "txt":
                            contentType = 'data:text/plain;base64,';
                            break;
                        case "png":
                        case "jpeg":
                        case "jpg":
                            contentType = 'data:image/jpeg;base64,';
                            break;
                        case "doc":
                            contentType = 'data:application/msword;base64,';
                            break;
                        case "docx":
                            contentType = 'data: application / vnd.openxmlformats - officedocument.wordprocessingml.document; base64,';
                            break;
                        case "xlsx":
                            contentType = 'data: application / vnd.openxmlformats - officedocument.spreadsheetml.sheet; base64,';
                            break;
                        default:
                    }

                    return contentType;
                }

                function formatDate(dateValue) {
                    var splitcol = dateValue.split(' ');
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

                function bindNegativeRiskChart(data) {
                    var chartData = [];
                    var rowData;
                    angular.forEach(data, function (values) {
                        rowData = values.indicators;
                        angular.forEach(rowData, function (value, key) {
                            var indexVal = index(chartData, key.toUpperCase());
                            if (indexVal != undefined) {
                                chartData[indexVal].y = chartData[indexVal].y + value;
                            } else {
                                chartData.push({ "key": key.toUpperCase(), "y": value });
                            }
                        }, chartData);
                    });
                    return chartData;
                }

                function bindNegativeData(negativeNewsData, riskDnaData) {
                    angular.forEach(negativeNewsData, function (values) {
                        values.doa = formatDate(values.doa);
                        var keys = [];
                        var riskScore = 0;
                        angular.forEach(values.indicators, function (value, key) {
                            keys.push(key);
                        });

                        angular.forEach(riskDnaData.sequences, function (riskData) {
                            if (riskData.sequenceType === 'NEGATIVENEWS') {
                                var riskGenes = riskData.genes;
                                angular.forEach(riskGenes, function (riskGene) {
                                    if (riskGene.geneValue === values.title) {
                                        riskScore = riskGene.geneScore;
                                    }
                                });
                            }
                        });

                        values.keywords = keys.join(", ");
                        values.riskScore = riskScore;
                    });
                    return negativeNewsData;
                }

                function largeTextHandler(params) {
                    if (params.value.length > 160) {
                        return "<span title='" + params.value + "'>" + params.value.substring(0, 160) + "...</span>";
                    } else {
                        return params.value;
                    }
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

                function isValidateHandler(params) {
                    var isValid = params.data.validated;
                    var rtnVal;
                    var paramVal = "'" + params.data.documentId + "'";
                    if (isValid) {
                        rtnVal = '<span style="display: inline-block"><div class="switch"><input id="cmn-toggle-' + params.data.documentId + '" class="cmn-toggle cmn-toggle-round" type="checkbox" ng-click="onDocValidationChange(' + paramVal + ')" checked><label for="cmn-toggle-' + params.data.documentId + '"></label></div></span>';
                    } else {
                        rtnVal = '<span style="display: inline-block"><div class="switch"><input id="cmn-toggle-' + params.data.documentId + '" class="cmn-toggle cmn-toggle-round" type="checkbox" ng-click="onDocValidationChange(' + paramVal + ')" ><label for="cmn-toggle-' + params.data.documentId + '"></label></div></span>';
                    }
                    // + '</span>';
                    return rtnVal;
                }

                function guid() {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                          .toString(16)
                          .substring(1);
                    }
                    //return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
                    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
                }

                function doumentCheckBoxHandler(params, idName) {
                    var value;
                    var paramVal;
                    if (idName === 'chkDocID') {
                        value = "'" + params.data.documentId + "'";
                        paramVal = "'" + params.data.documentId + "'";
                        return '<input type="checkbox" value=' + value + ' ng-click="DeleteDocument(' + paramVal + ')" />';
                    } else if (idName === 'chkTasksGridID') {
                        value = "'" + params.data.taskID + "'";
                        paramVal = "'" + params.data.taskID + "'";
                        return '<input type="checkbox" value=' + value + ' ng-click="DeleteTasks(' + paramVal + ')" />';
                    }
                    return '<span></span>';
                }

                $scope.onDocValidationChange = function (documentId) {
                    var array = $scope.DocumentCenterGrid.rowData;

                    for (var i = 0; i < array.length; i++) {
                        var fileName = array[i].documentId;
                        if (fileName === documentId.trim()) {
                            array[i].validated = !array[i].validated;
                            break;
                        }
                    }
                    $scope.DocumentCenterGrid.rowData = array;
                    $scope.DocumentCenterGrid.api.onNewRows();
                }

                //For RiskDna mouseover 
                $scope.showPopover = function () {
                    this.popoverIsVisibleGene = true;
                };

                $scope.hidePopover = function () {
                    this.popoverIsVisibleGene = false;
                };

                $scope.hidePopoverGene = function (index) {
                    var rows = angular.element('.attributeRiskGrid .tabRow > div');
                    angular.element(rows[index]).css('border', '');
                };

                $scope.showPopoverGene = function (index, event) {
                    var elem = event.currentTarget;
                    //                            elem.style[globals.defaultVars.getVendor.js] = 
                    var borderColor = angular.element(elem).css('background-color');
                    var rows = angular.element('.attributeRiskGrid .tabRow > div');
                    angular.element(rows[index]).css('border', '2px solid ' + borderColor);
                };

                $scope.toggle = function (active, new1, email, span) {
                    var data;
                    var i;
                    if (active && !new1 && span === 'off') {
                        data = $scope.cardDatas;
                        for (i = 0; i < data.length; i++) {
                            if (data[i].email === email) {
                                data[i].active = false;
                            }
                        }
                        $scope.cardDatas = data;
                    }
                    if (!active && !new1 && span === 'on') {
                        data = $scope.cardDatas;
                        for (i = 0; i < data.length; i++) {
                            if (data[i].email === email) {
                                data[i].active = true;
                            }
                        }
                        $scope.cardDatas = data;
                    }
                }
                //changeLogGrid Section
                var changeLogColumnDefs = [
                    {
                        headerName: "User",
                        field: "",
                        width: 400 * globals.defaultVars.w / globals.defaultVars.winRef,
                        cellClass: 'rag-entity',
                        suppressSorting: true,
                        cellRenderer: function (params) {
                            return '<b>' + params.data.snapshot.personBaseData.firstName + ' ' + params.data.snapshot.personBaseData.lastName + '</b> - ' + params.data.snapshot.personBaseData.organizationID;
                        }
                    },
                    {
                        headerName: "Type",
                        field: "eventType",
                        suppressSorting: true,
                        width: 300 * globals.defaultVars.w / globals.defaultVars.winRef
                    },
                    {
                        headerName: "Date",
                        field: "eventDate",
                        width: 350 * globals.defaultVars.w / globals.defaultVars.winRef,
                        //comparator: dateComparator,
                        sort: 'asc'
                    },
                    {
                        headerName: "Action",
                        field: "eventAction",
                        suppressSorting: true,
                        width: 400 * globals.defaultVars.w / globals.defaultVars.winRef,
                        cellRenderer: largeTextHandler
                    },
                   {
                       headerName: "",
                       field: "",
                       suppressSorting: true,
                       width: 300 * globals.defaultVars.w / globals.defaultVars.winRef,
                       cellRenderer: function (params) {
                           return '<a href title="Click to View Entity Log data" ng-click="reloadEntityDetail('
                               + Number(new Date(params.data.eventDate)) + ');"><span class="clickButton">Show Snapshot</span></a>';
                       }
                   }
                ];
                $scope.changeLogGridOptions = {
                    columnDefs: changeLogColumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 40 * globals.defaultVars.w / globals.defaultVars.winRef, //0.031 * angular.element(window).width(),
                    rowHeight: 70 * globals.defaultVars.w / globals.defaultVars.winRef, //0.0416 * angular.element(window).width(),           
                    enableSorting: true,
                    angularCompileRows: true
                };

                //accountGrid Section
                var accountGridColumnDefs = [
                    {
                        headerName: "",
                        field: "",
                        width: 520 * globals.defaultVars.w / globals.defaultVars.winRef,
                        cellRenderer: function (params) {
                            return '<b>' + params.data.accountType.substr(0, 1).toUpperCase() + params.data.accountType.substr(1).toLowerCase() + ' Account</b><br/>' + 'Account Number - ' + params.data.accountNumber;
                        }
                    },
                    {
                        headerName: "",
                        field: "",
                        width: 200 * globals.defaultVars.w / globals.defaultVars.winRef,
                        cellRenderer: function () {
                            return '<span><b>Personal Account</b></span>';
                        }
                    }
                ];
                $scope.accountgridOptions = {
                    columnDefs: accountGridColumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 0,
                    rowHeight: 80 * globals.defaultVars.w / globals.defaultVars.winRef,
                    angularCompileRows: true
                };

                //activityRiskGrid Section
                var activityRiskGridcolumnDefs = [
                  { headerName: "Item ID", width: 400 * globals.defaultVars.w / globals.defaultVars.winRef, field: "id", suppressMenu: true, suppressSorting: true },
                  { headerName: "Item type", width: 300 * globals.defaultVars.w / globals.defaultVars.winRef, field: "itemType", suppressMenu: true, suppressSorting: true },
                  { headerName: "Item ", width: 150 * globals.defaultVars.w / globals.defaultVars.winRef, field: "item", suppressSorting: true },
                  { headerName: "Account Number", width: 250 * globals.defaultVars.w / globals.defaultVars.winRef, field: "accountNumber", suppressMenu: true, suppressSorting: true },
                  { headerName: "Closed Date", width: 250 * globals.defaultVars.w / globals.defaultVars.winRef, field: "closedDate", suppressMenu: true, comparator: dateComparator, sort: 'asc' },
                  { headerName: "Status", width: 250 * globals.defaultVars.w / globals.defaultVars.winRef, field: "status" },
                  { headerName: "Assigned Analyst", width: 250 * globals.defaultVars.w / globals.defaultVars.winRef, field: "assignedAnalyst", suppressMenu: true, suppressSorting: true }
                ];


                $scope.activityRiskGridOptions = {
                    columnDefs: activityRiskGridcolumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 60 * globals.defaultVars.w / globals.defaultVars.winRef,
                    rowHeight: 80 * globals.defaultVars.w / globals.defaultVars.winRef,
                    enableFilter: true,
                    enableSorting: true,
                    angularCompileRows: true
                };

                //watchListGrid Section
                var watchListGridColumnDefs = [
                    {
                        headerName: "Entity Name",
                        field: "names",
                        width: 300 * globals.defaultVars.w / globals.defaultVars.winRef
                    },
                    {
                        headerName: "Watchlist Provider",
                        field: "watchlistProvider",
                        width: 240 * globals.defaultVars.w / globals.defaultVars.winRef
                    },
                    {
                        headerName: "List Name",
                        field: "watchlistNames",
                        width: 300 * globals.defaultVars.w / globals.defaultVars.winRef
                    },
                    {
                        headerName: "Ranking",
                        field: "ranking",
                        width: 200 * globals.defaultVars.w / globals.defaultVars.winRef,
                        cellRenderer: function (params) {
                            return "StrengthIndex: " + params.data.ranking.StrengthIndex + "<br/>" + " ExposureIndex: " + params.data.ranking.ExposureIndex;
                            // return params.data.ranking;
                        }
                    }
                ];
                $scope.watchListGridOptions = {
                    columnDefs: watchListGridColumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 40 * globals.defaultVars.w / globals.defaultVars.winRef,
                    rowHeight: 80 * globals.defaultVars.w / globals.defaultVars.winRef,
                    angularCompileRows: true
                };

                //pepHitsGrid Section
                var pepHitsGridColumnDefs = [
                    {
                        headerName: "Entity Name",
                        field: "entityName",
                        width: 300 * globals.defaultVars.w / globals.defaultVars.winRef
                    },
                    {
                        headerName: "PEP Provider",
                        field: "PEP Provider",
                        width: 210 * globals.defaultVars.w / globals.defaultVars.winRef
                    },
                    {
                        headerName: "PEP List",
                        field: "PEP List",
                        width: 190 * globals.defaultVars.w / globals.defaultVars.winRef
                    }
                ];
                $scope.pepHitsGridOptions = {
                    columnDefs: pepHitsGridColumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 40 * globals.defaultVars.w / globals.defaultVars.winRef,
                    rowHeight: 80 * globals.defaultVars.w / globals.defaultVars.winRef,
                    angularCompileRows: true
                };

                //negativeRiskGrid Section
                var negativeRiskGridcolumnDefs = [
                    {
                        headerName: "Article Name",
                        width: 300 * globals.defaultVars.w / globals.defaultVars.winRef,
                        field: "title",
                        suppressSorting: true
                    },
                    {
                        headerName: "Adverse Keyword Hits",
                        width: 300 * globals.defaultVars.w / globals.defaultVars.winRef,
                        field: "keywords",
                        suppressSorting: true
                    },
                    {
                        headerName: "Date of Publication",
                        width: 220 * globals.defaultVars.w / globals.defaultVars.winRef,
                        field: "doa",
                        suppressSorting: false,
                        comparator: dateComparator
                    },
                    {
                        headerName: "Risk Score",
                        width: 150 * globals.defaultVars.w / globals.defaultVars.winRef,
                        field: 'riskScore',
                        suppressSorting: false
                    },
                     {
                         headerName: "Related Links",
                         width: 200 * globals.defaultVars.w / globals.defaultVars.winRef,
                         field: "url",
                         suppressSorting: true,
                         cellRenderer: function (params) {
                             var title = "'" + params.data.title + "'";
                             return '<a style="cursor:pointer!important;" href="' + params.data.url + '"  target="_new">' +
                                 '<span class="clickButton">Related Links</span></a>' + "&nbsp;&nbsp;&nbsp; " + '<a title="Click to Open Negative News Data" ng-click="NegativeNewsDataPopup('
                                 + title + ')" style="cursor:pointer!important;"><i class="fa fa-newspaper-o"></i></a>';
                         }
                     }
                ];

                $scope.negativeRiskGridOptions = {
                    columnDefs: negativeRiskGridcolumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 40 * globals.defaultVars.w / globals.defaultVars.winRef,
                    rowHeight: 70 * globals.defaultVars.w / globals.defaultVars.winRef,
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

                $scope.showToolTipInPieChart = function () {
                    return function (key) {
                        return '<b>' + key + '</b>';
                    }
                }

                /* Document, Notes, taks*/
                /*--------Common Function-----------------*/
                var getItemFromArray = function (array, value) {
                    for (var i = 0; i < array.length; i++) {
                        var fileName = array[i].documentName;
                        if (fileName === value.trim())
                            return array[i];
                    }
                }

                $scope.DownloadFile = function (fileName) {
                    fileName = fileName.trim();

                    var response = getItemFromArray($scope.DocumentCenterGrid.rowData, fileName);

                    var a = document.createElement('a');
                    var fileExt = fileName.split('.')[1];

                    a.href = getContentType(fileExt) + response.serializedContent;
                    a.target = '_blank';
                    a.download = fileName;

                    document.body.appendChild(a);
                    a.click();
                }

                var removeItemFromArray = function (array, value) {
                    var index = array.indexOf(value);
                    if (index === -1)
                        array.push(value);
                    else {
                        if (array.length <= 0)
                            return array;
                        array.splice(index, 1);
                    }
                    return array;
                }

                /*--------Load DocumentCenterGrid-----------------*/
                $scope.IsFileSelected = false;
                $scope.FileName = "";

                $scope.DocumentIDArray = [];
                $scope.DeleteDocument = function (selectedId) {
                    var array = $scope.DocumentIDArray;
                    var outArray = removeItemFromArray(array, selectedId);
                    $scope.DocumentIDArray = outArray;
                }

                $scope.RemoveDocument = function () {
                    var selectedRowArray = $scope.DocumentIDArray;
                    var notesGridArray = $scope.DocumentCenterGrid.rowData;

                    var newArrayForDcoument = [];
                    for (var i = 0; i < notesGridArray.length; i++) {
                        var idVal = parseInt(notesGridArray[i].ID);
                        var index = selectedRowArray.indexOf(idVal);
                        if (index === -1)
                            newArrayForDcoument.push(notesGridArray[i]);
                    }

                    $scope.DocumentIDArray = [];
                    $scope.DocumentCenterGrid.rowData = newArrayForDcoument;
                    $scope.DocumentCenterGrid.api.onNewRows();
                }

                $scope.file_changed = function (element) {
                    $scope.$apply(function () {
                        var fileUploaded = element.files[0];
                        //var fileExt = fileUploaded.name.split('.')[1];
                        //var fileExtArray = ['.pdf', '.docx', '.doc', '.txt', '.xlsx', '.png', '.jpeg', '.jpg', '.csv'];
                        //if (fileExtArray.indexOf(fileExtArray) == -1) {

                        //    return;
                        //}

                        var reader = new FileReader();
                        reader.onload = function () {
                            // handle onload
                            var fileData = reader.result;
                            $scope.UploaddedFileData = fileData.replace('data:application/pdf;base64,', '').replace('data:image/jpeg;base64,', '')
                            .replace('data:application/msword;base64,', '').replace('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,', '')
                            .replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', '').replace('data:text/plain;base64,', '')
                            .replace('data:application/vnd.ms-excel;base64,', '').replace('data:', '');
                        };
                        reader.readAsDataURL(fileUploaded);
                        $scope.UploaddedFile = fileUploaded;
                        $scope.IsFileSelected = true;
                        $scope.FileName = fileUploaded.name;
                    });
                };

                $scope.AddDocument = function (fileDesc) {
                    if (fileDesc == undefined || fileDesc === '')
                        return;
                    var userInfo = authenticationSvc.getUserInfo();
                    var files = $scope.UploaddedFile;
                    if (files != null) {
                        //var maxId = $scope.DocumentCenterGrid.rowData.length + 1;
                        var newGuidId = guid();
                        var fileName = files.name;
                        var fileData = $scope.UploaddedFileData;
                        var currentDate = new Date().toLocaleDateString();
                        var documentRecord = {
                            //"ID": maxId,
                            "documentName": fileName,
                            "serializedContent": fileData,
                            "uploadDate": currentDate,
                            "lastUpdated": currentDate,
                            "validated": false,
                            "uploadedBy": userInfo.UserName,
                            "shortDescription": fileDesc,
                            "screenId": "DETAILS-72ded2c2-c0aa-4a31-92fb-6b0487029a0f",
                            "entityId": "72ded2c2-c0aa-4a31-92fb-6b0487029a0f",
                            "documentId": newGuidId
                        }

                        $scope.DocumentCenterGrid.rowData.push(documentRecord);
                        $scope.DocumentCenterGrid.api.onNewRows();
                        $scope.closePopup();

                        jQuery("#FileDesc").val('');
                        jQuery("#picFile").val('');
                        $scope.IsFileSelected = false;
                    }
                };
                
                var documentCenterGridColumnDefs = [
                    {
                        headerName: "FileName",
                        field: "",
                        width: 290 * globals.defaultVars.w / globals.defaultVars.winRef,
                        cellClass: 'rag-entity',
                        cellRenderer: function (params) {
                            var documentName = "' " + params.data.documentName + "'";
                            return '<span><b> <a ng-click="DownloadFile(' + documentName + ')"> ' + params.data.documentName + '</a> </b> <br />' + params.data.shortDescription + '-By ' + params.data.uploadedBy + '</span>';
                        }
                    },
                    {
                        headerName: "Upload Date",
                        width: 115 * globals.defaultVars.w / globals.defaultVars.winRef,
                        field: "uploadDate",
                        filter: 'date'

                    },
                    {
                        headerName: "Last Updated",
                        suppressMenu: 'true',
                        width: 115 * globals.defaultVars.w / globals.defaultVars.winRef,
                        field: "lastUpdated"
                    },
                    {
                        headerName: "Validated",
                        width: 115 * globals.defaultVars.w / globals.defaultVars.winRef,
                        field: "validated",
                        cellRenderer: function (params) { return isValidateHandler(params) }
                    },
                    {
                        headerName: "fileData",
                        field: "serializedContent",
                        hide: true
                    }
                ];

                $scope.DocumentCenterGrid = {
                    columnDefs: documentCenterGridColumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 50 * globals.defaultVars.w / globals.defaultVars.winRef,
                    rowHeight: 60 * globals.defaultVars.w / globals.defaultVars.winRef,
                    enableFilter: false,
                    enableSorting: false,
                    angularCompileRows: true
                };

                /*--------Load NotesGrid-----------------*/
                $scope.notesGridCellClicked = false;
                $scope.NotesIDArray = [];
                $scope.DeleteNotes = function (selectedId) {
                    var array = $scope.NotesIDArray;
                    var outArray = removeItemFromArray(array, selectedId);
                    $scope.NotesIDArray = outArray;
                }

                $scope.RemoveNotes = function () {
                    if ($scope.NotesIDArray.length < 0) {
                        return;
                    }
                    var selectedRowArray = $scope.NotesIDArray;
                    var notesGridArray = $scope.NotesGrid.rowData;

                    var newArrayForNotes = [];
                    for (var i = 0; i < notesGridArray.length; i++) {
                        var idVal = parseInt(notesGridArray[i].ID);
                        var index = selectedRowArray.indexOf(idVal);
                        if (index === -1)
                            newArrayForNotes.push(notesGridArray[i]);
                    }

                    $scope.NotesIDArray = [];
                    $scope.NotesGrid.rowData = newArrayForNotes;
                    $scope.NotesGrid.api.onNewRows();
                }

                /* Form Submit Method */
                $scope.AddNotes = function (notesTitle, notesData) {
                    if (notesTitle == undefined || notesTitle === '' || notesData == undefined || notesData === '')
                        return;
                    // var userInfo = authenticationSvc.getUserInfo();
                    var currentDate = new Date().toLocaleDateString();
                    //var maxId = $scope.NotesGrid.rowData.length + 1;
                    // var noteDesc = currentDate + " - By " + userInfo.UserName;
                    //var noteId = "note222" + maxId;
                    var newGuidId = guid();
                    var documentRecord = {
                        //"ID": maxId,
                        "noteID": newGuidId,
                        "title": notesTitle,
                        "createdDate": currentDate,
                        "userID": "2985e5a2-8405-4683-a5dd-d4d8cee6b90e",
                        "entityID": "72ded2c2-c0aa-4a31-92fb-6b0487029a0f",
                        "text": notesData,
                        "screenID": "DETAILS-72ded2c2-c0aa-4a31-92fb-6b0487029a0f"
                    }

                    $scope.NotesGrid.rowData.push(documentRecord);
                    $scope.NotesGrid.api.onNewRows();

                    $scope.closePopup();

                    jQuery("#NotesTitle").val('');
                    jQuery("#NotesData").val('');
                };

                $scope.showNotes = function ($event, notesId) {

                    notesId = notesId.trim();
                    var taskGridArray = $scope.NotesGrid.rowData;
                    var newArrayForTask = [];
                    var record;
                    for (var i = 0; i < taskGridArray.length; i++) {
                        var idVal = taskGridArray[i].noteID;

                        if (notesId === idVal) {
                            newArrayForTask.push(taskGridArray[i]);
                            record = taskGridArray[i];

                            jQuery("#NotesTitle").val(record.title);
                            jQuery("#NotesData").val(record.text);

                            this.addNewDocument($event, 'notes');
                            $scope.notesGridCellClicked = true;
                            break;
                        }
                    }
                }

                $scope.addPersona = function () {
                    if ($scope.PersonaForm.$valid) {

                        if ($scope.personaId == null || $scope.personaId == undefined) $scope.personaId = "";
                        if ($scope.personaIdType == null || $scope.personaIdType == undefined) $scope.personaIdType = "";
                        if ($scope.personaFirstName == null || $scope.personaFirstName == undefined) $scope.personaFirstName = "";
                        if ($scope.personaLastName == null || $scope.personaLastName == undefined) $scope.personaLastName = "";
                        if ($scope.personaPhoneNo == null || $scope.personaPhoneNo == undefined) $scope.personaPhoneNo = "";
                        if ($scope.personaEmail == null || $scope.personaEmail == undefined) $scope.personaEmail = "";
                        if ($scope.personaStreet1 == null || $scope.personaStreet1 == undefined) $scope.personaStreet1 = "";
                        if ($scope.personaStreet2 == null || $scope.personaStreet2 == undefined) $scope.personaStreet2 = "";
                        if ($scope.personaCity == null || $scope.personaCity == undefined) $scope.personaCity = "";
                        if ($scope.personaState == null || $scope.personaState == undefined) $scope.personaState = "";
                        if ($scope.personaZipCode == null || $scope.personaZipCode == undefined) $scope.personaZipCode = "";
                        if ($scope.personaCountry == null || $scope.personaCountry == undefined) $scope.personaCountry = "";

                        var jsonObj = $scope.cardDatas;
                        var cardData = {};
                        cardData["name"] = $scope.personaFirstName + " " + $scope.personaLastName;
                        cardData["active"] = true;
                        cardData["new"] = true;
                        cardData["source"] = "newly added";
                        cardData["phone"] = $scope.personaPhoneNo;
                        cardData["email"] = $scope.personaEmail;
                        if ($scope.personaStreet1 == null || $scope.personaStreet1 == undefined || $scope.personaStreet1 == "") {
                            cardData["address"] = "";
                        } else {
                            cardData["address"] = $scope.personaStreet1 + " " + $scope.personaStreet2 + ", " + $scope.personaCity + ", " + $scope.personaState + " " + $scope.personaZipCode;
                        }

                        cardData["shortname"] = $scope.personaFirstName.substring(0, 1).toUpperCase() + $scope.personaLastName.substring(0, 1).toUpperCase();
                        cardData["score"] = 0;
                        cardData["id"] = $scope.personaId;
                        cardData["idtype"] = $scope.personaIdType;
                        cardData["country"] = $scope.personaCountry;
                        jsonObj.push(cardData);

                        $scope.cardDatas = jsonObj;
                        $scope.cardcount = $scope.cardDatas.length;
                        $scope.PersonaForm.$setPristine();
                        $scope.closePersonaPopup();
                    }
                };

                function noteGridDesc(params) {
                    var currentDate = params.data.createdDate;
                    var noteDesc = currentDate + " - By " + params.data.userID;
                    var noteId = "' " + params.data.noteID + "'";
                    return '<span><b> <a ng-click="showNotes($event,' + noteId + ')"> ' + params.data.title + '</a> </b>  <br / > ' + noteDesc + ' <br / > <p>' + params.data.text + '</p> </span>';
                }

                var notesGridColumnDefs = [
                    {
                        headerName: "",
                        width: 600 * globals.defaultVars.w / globals.defaultVars.winRef,
                        cellClass: 'rag-entity',
                        cellRenderer: function (params) {
                            return noteGridDesc(params);
                        }
                    }
                ];

                $scope.NotesGrid = {
                    columnDefs: notesGridColumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 0,
                    rowHeight: 120 * globals.defaultVars.w / globals.defaultVars.winRef,
                    enableFilter: false,
                    enableSorting: false,
                    angularCompileRows: true
                };

                /*--------Load TasksGrid-----------------*/
                var removeTaskFromArray = function (array, value) {
                    var index = array.indexOf(value);
                    if (index === -1)
                        array.push(value);
                    else {
                        if (array.length <= 0)
                            return array;
                        array.splice(index, 1);
                    }
                    return array;
                }

                $scope.TaskIDArray = [];
                $scope.DeleteTasks = function (selectedId) {
                    var array = $scope.TaskIDArray;
                    var outArray = removeTaskFromArray(array, selectedId);
                    $scope.TaskIDArray = outArray;
                }

                $scope.RemoveTask = function () {
                    var selectedRowArray = $scope.TaskIDArray;
                    var taskGridArray = $scope.TasksGrid.rowData;
                    var newArrayForTask = [];
                    for (var i = 0; i < taskGridArray.length; i++) {
                        var idVal = taskGridArray[i].taskID;
                        var index = selectedRowArray.indexOf(idVal);
                        if (index === -1)
                            newArrayForTask.push(taskGridArray[i]);
                    }

                    $scope.TaskIDArray = [];
                    $scope.TasksGrid.rowData = newArrayForTask;
                    $scope.TasksGrid.api.onNewRows();
                }

                $scope.CompletedTask = function () {
                    var selectedRowArray = $scope.TaskIDArray;
                    var taskGridArray = $scope.TasksGrid.rowData;
                    // var newArrayForTask = [];
                    for (var i = 0; i < taskGridArray.length; i++) {
                        var idVal = taskGridArray[i].taskID;
                        var index = selectedRowArray.indexOf(idVal);
                        if (index !== -1)
                            taskGridArray[i].completed = true;
                    }

                    $scope.TaskIDArray = [];
                    $scope.TasksGrid.rowData = taskGridArray;
                    $scope.TasksGrid.api.onNewRows();
                }

                /* Form Submit Method */
                $scope.AddTask = function (task) {
                    if (task == undefined || task === '')
                        return;
                    var currentDate = new Date().toLocaleDateString();
                    var newGuidId = guid();

                    var documentRecord = {
                        taskID: newGuidId,
                        task: task,
                        taskDate: currentDate,
                        order: 0,
                        completed: false
                    }
                    $scope.TasksGrid.rowData.push(documentRecord);
                    $scope.TasksGrid.api.onNewRows();

                    $scope.Task = '';
                    $scope.closePopup();
                };


                $scope.MoveUpTask = function (taskId, order) {

                    var prevTask;

                    var sortedTasks = $scope.TasksGrid.rowData.sort(function (a, b) {
                        return a.order - b.order;
                    }).reverse();

                    var tempSortedTasks = sortedTasks;

                    for (var i = 0; i < sortedTasks.length; i++) {

                        if (sortedTasks[i].order === order && sortedTasks[i].taskID === taskId) {
                            if (prevTask != null) {
                                tempSortedTasks[i].order = prevTask.order;
                                prevTask.order = order;
                                tempSortedTasks[i - 1] = prevTask;
                                $scope.TasksGrid.rowData = tempSortedTasks;
                                $scope.TasksGrid.api.onNewRows();
                            }
                            break;
                        }
                        prevTask = sortedTasks[i];
                    }
                };

                $scope.MoveDownTask = function (taskId, order) {
                    var prevTask;

                    var sortedTasks = $scope.TasksGrid.rowData.sort(function (a, b) {
                        return a.order - b.order;
                    });

                    var tempSortedTasks = sortedTasks;

                    for (var i = 0; i < sortedTasks.length; i++) {

                        if (sortedTasks[i].order === order && sortedTasks[i].taskID === taskId) {
                            if (prevTask != null) {
                                tempSortedTasks[i].order = prevTask.order;
                                prevTask.order = order;
                                tempSortedTasks[i - 1] = prevTask;
                                $scope.TasksGrid.rowData = tempSortedTasks;
                                $scope.TasksGrid.api.onNewRows();
                            }
                            break;
                        }
                        prevTask = sortedTasks[i];
                    }
                };

                function tasksGrid(params) {
                    return '  <span class="taskRow"><b>' + params.data.task + '</b> </span>';
                }

                var tasksGridColumnDefs = [
                    {
                        headerName: "taskID",
                        field: "taskID",
                        hide: true
                    },
                    { headerName: "order", field: "order", hide: true, sort: "desc" },
                    {
                        headerName: "",
                        width: 590 * globals.defaultVars.w / globals.defaultVars.winRef,
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
                        width: 50 * globals.defaultVars.w / globals.defaultVars.winRef,
                        cellRenderer: function (params) { return doumentCheckBoxHandler(params, 'chkTasksGridID'); }
                    }
                ];

                $scope.TasksGrid = {
                    columnDefs: tasksGridColumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 0,
                    rowHeight: 40 * globals.defaultVars.w / globals.defaultVars.winRef,
                    enableFilter: false,
                    enableSorting: false,
                    angularCompileRows: true,
                    groupHeaders: false
                };


                function pageLoad() {
                    //Loads Attribure tab data
                    $scope.entityDetail = $scope.dataObject.person;
                    //$scope.entityDetail.personas = angular.copy($scope.cardData);
                    

                    //Prepare card data
                    $scope.cardcount = $scope.entityDetail.personas.length;
                    var cardcount = $scope.entityDetail.personas.length;

                    var jsonObj = [];
                    var i;
                    for (i = 0; i < cardcount; i++) {

                        var data = $scope.entityDetail.personas[i];

                        var cardData = {};
                        cardData["name"] = data.names[0];
                        cardData["phone"] = data.phones[0].phoneNumber;
                        cardData["email"] = data.emails[0].emailAddress;
                        cardData["address"] = data.addresses[0];
                        cardData["new"] = data.isNew;
                        cardData["active"] = data.isActive;
                        cardData["score"] = data.matchScore;
                        cardData["source"] = data.sources[0];

                        var finalVal = "";
                        var spl = data.names[0].split(' ');
                        for (var j = 0; j < spl.length; j++) {
                            if (j === 2) break;
                            finalVal += spl[j].substr(0, 1);
                        }
                        cardData["shortname"] = finalVal;

                        jsonObj.push(cardData);
                    }
                    $scope.cardDatas = jsonObj;

                    //Prepare primary card data
                    var primaryData = {};
                    primaryData["shortname"] = $scope.entityDetail.personBaseData.firstName.substr(0, 1) + $scope.entityDetail.personBaseData.lastName.substr(0, 1);
                    primaryData["score"] = $scope.entityDetail.riskDNA.riskDnaScore;
                    primaryData["risktype"] = $scope.entityDetail.riskDNA.riskDnaScore <= 33.33 ? 'LOW RISK'
                        : $scope.entityDetail.riskDNA.riskDnaScore > 33.33 && $scope.entityDetail.riskDNA.riskDnaScore <= 66.66
                        ? 'MEDIUM RISK' : 'HIGH RISK';

                    $scope.primaryDatas = primaryData;

                    //Risk dna overtime log
                    var riskDnaData = angular.copy($scope.dataObject.history.events);
                    var dnaData = [];
                    var rowItemDetail;
                    for (i = 0; i < riskDnaData.length; i++) {
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
                    rowItemDetail.push($scope.entityDetail.riskDNA.riskDnaScore);
                    dnaData.push(rowItemDetail);
                    $scope.riskDnaLog = [
                          {
                              "key": "riskDnaScore",
                              "values": dnaData
                          }
                    ];

                    var negativeNewsData = $scope.entityDetail.eddPersonData.negativeNewsData.articles;
                    var chartdata = bindNegativeRiskChart(negativeNewsData);
                    $scope.adverseKeywordData = chartdata;

                    negativeNewsData = bindNegativeData(negativeNewsData, $scope.entityDetail.riskDNA);

                    $scope.negativeRiskGridOptions.rowData = negativeNewsData;
                    $scope.negativeRiskGridOptions.api.onNewRows();

                    $scope.accountgridOptions.rowData = $scope.entityDetail.cddPersonData.activityCDD.accounts;
                    $scope.accountgridOptions.api.onNewRows();

                    $scope.watchListGridOptions.rowData = $scope.entityDetail.cddPersonData.watchlistCDD.watchlistHits;
                    $scope.watchListGridOptions.api.onNewRows();

                    $scope.pepHitsGridOptions.rowData = $scope.entityDetail.cddPersonData.watchlistCDD.pepHits;
                    $scope.pepHitsGridOptions.api.onNewRows();

                    $scope.TasksGrid.rowData = $scope.dataObject.tasks;
                    $scope.TasksGrid.api.onNewRows();

                    $scope.NotesGrid.rowData = $scope.dataObject.notes;
                    $scope.NotesGrid.api.onNewRows();

                    $scope.DocumentCenterGrid.rowData = $scope.dataObject.documents;
                    $scope.DocumentCenterGrid.api.onNewRows();

                    $scope.changeLogGridOptions.rowData = $scope.dataObject.history.events;
                    $scope.changeLogGridOptions.api.onNewRows();

                    //Activity Risk tab
                    var activityData = $scope.entityDetail.cddPersonData.activityCDD;
                    var activityDataArray = [];
                    var rowData;
                    angular.forEach(activityData, function (value, key) {
                        rowData = value;
                        if (key === 'alerts') {
                            angular.forEach(rowData, function (values) {
                                this.push({
                                    "id": values.id, "itemType": values.alertType,
                                    "item": "Alert", "accountNumber": values.transactions[0].accountNumber,
                                    "closedDate": values.alertDueDate, "status": values.alertStatus,
                                    "assignedAnalyst": values.entityName
                                });
                            }, activityDataArray);
                        } else if (key === 'cases') {
                            angular.forEach(rowData, function (values) {
                                this.push({
                                    "id": values.id, "itemType": values.caseType, "item": "Case",
                                    "accountNumber": values.transactions[0].accountNumber, "closedDate": values.caseDueDate,
                                    "status": values.caseStatus, "assignedAnalyst": values.entityName
                                });
                            }, activityDataArray);
                        }
                    });

                    $scope.activityRiskGridOptions.rowData = activityDataArray;
                    $scope.activityRiskGridOptions.api.onNewRows();

                    //Network Risk
                    var lengthMain = 50,
                        widthScale = 2,
                        green = 'green',
                        red = '#C5000B',
                        gray = 'gray',
                        black = '#2B1B17',
                        white = '#fff';

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
                    var networkData = $scope.entityDetail.eddPersonData.networkData.nodes;
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
                                if ($scope.relationship.indexOf(nodesData[i].group) === -1) {
                                    nodesData.splice(i, 1);
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

                        var edges = visDataSet(edgesData);
                        var nodes = visDataSet(nodesData);

                        $scope.networkChartdata = {
                            nodes: nodes,
                            edges: edges
                        };
                        scope.$watch(networkChartdata);
                    };

                    var rowNodeDetail = {};
                    var rowEdgeDetail = {};
                    rowNodeDetail = {
                        id: 1,
                        label: '',
                        group: 'Primary',
                        physics: false,
                        title: $scope.entityDetail.personBaseData.firstName
                            + ' ' + $scope.entityDetail.personBaseData.lastName
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
                        } else if (networkData[iNetwork].relationship === 'Counterparties') {
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
                        var colorCode = networkData[iNetwork].attributes.confidenceScore < 33.34 ? red : (networkData[iNetwork].attributes.confidenceScore > 66.67 ? green : gray);

                        rowEdgeDetail = {
                            from: 1,
                            to: iNetwork + 2,
                            length: lengthMain,
                            width: widthScale * colorStrength,
                            color: colorCode
                        };
                        edgesData.push(rowEdgeDetail);
                    }

                    $scope.loadedges = angular.copy(edgesData);
                    $scope.loadnodes = angular.copy(nodesData);

                    var edges = visDataSet(edgesData);
                    var nodes = visDataSet(nodesData);

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
                                    background: white,
                                    border: black
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
                                    background: white,
                                    border: black
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
                                    background: white,
                                    border: black
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
                                    background: white,
                                    border: black
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
                                    background: white,
                                    border: black
                                },
                                fixed: {
                                    x: true,
                                    y: true
                                }
                            }
                        }
                    };
                }

                function loadData(param) {
                    if (param !== "postback") {
                        $http.get("../../../sampleJson/personObject.json")
                            .then(function(res) {
                                $scope.dataObject = res.data;
                                pageLoad();

                            });
                    } else {
                        pageLoad();
                    }
                }

                loadData("");

                $scope.Refresh = function () {
                    $scope.eventDate = null;
                    jQuery(".selectorClass").show();
                    jQuery(".addNewCard").show();
                    loadData("postback");
                    $scope.cardDatas = angular.copy($scope.cardDataMain);
                    //Show Add/Edit/Delete buttons
                    
                };

                $scope.reloadEntityDetail = function (eventDate) {

                    $scope.cardDataMain = angular.copy($scope.cardDatas);
                    var entityEvents = angular.copy($scope.dataObject).history.events;

                    for (var i = 0; i < entityEvents.length; i++) {
                        if (Number(new Date(entityEvents[i].eventDate)) === eventDate) {

                            $scope.eventDate = entityEvents[i].eventDate;

                            //entity detail is used to load attribute tab data
                            var entityEventSnapshot = $scope.entityDetail = entityEvents[i].snapshot;

                            //Card Section reload
                            var cardcount = entityEventSnapshot.personas == undefined ? 0 : entityEventSnapshot.personas.length;
                            $scope.cardcount = cardcount;

                            var jsonObj = [];
                            for (var cardIndex = 0; cardIndex < cardcount; cardIndex++) {
                                var data = entityEventSnapshot.personas[cardIndex];

                                var cardData = {};
                                cardData["name"] = data.names[0];
                                cardData["phone"] = data.phones[0].phoneNumber;
                                cardData["email"] = data.emails[0].emailAddress;
                                cardData["address"] = data.addresses[0];
                                cardData["new"] = data.isNew;
                                cardData["active"] = data.isActive;
                                cardData["score"] = data.matchScore;
                                cardData["source"] = data.sources[0];

                                var finalVal = "";
                                var spl = data.names[0].split(' ');
                                for (var j = 0; j < spl.length; j++) {
                                    if (j === 2) break;
                                    finalVal += spl[j].substr(0, 1);
                                }
                                cardData["shortname"] = finalVal;

                                jsonObj.push(cardData);
                            }
                            $scope.cardDatas = jsonObj;

                            //Reset card detail and hide show next previous section
                            resetCards();
                            cardcount === 0 ? angular.element('.cardNav a').hide() : angular.element('.cardNav .cardNext').show();

                            //Set primary card data
                            var primaryData = {};
                            primaryData["shortname"] = entityEventSnapshot.personBaseData.firstName.substr(0, 1) + entityEventSnapshot.personBaseData.lastName.substr(0, 1);

                            if (entityEventSnapshot.riskDNA == undefined) {
                                primaryData["score"] = 0;
                                primaryData["risktype"] = 'LOW RISK';
                            } else {
                                primaryData["score"] = entityEventSnapshot.riskDNA.riskDnaScore;
                                primaryData["risktype"] = entityEventSnapshot.riskDNA.riskDnaScore <= 33.33 ?
                                    'LOW RISK' : entityEventSnapshot.riskDNA.riskDnaScore > 33.33 && entityEventSnapshot.riskDNA.riskDnaScore <= 66.66
                                    ? 'MEDIUM RISK' : 'HIGH RISK';
                            }
                            $scope.primaryDatas = primaryData;


                            //Associated accounts section, Watchlist Hits and Pep Hits tab section
                            if (entityEventSnapshot.cddPersonData != undefined) {

                                if (entityEventSnapshot.cddPersonData.activityCDD != undefined) {
                                    $scope.accountgridOptions.rowData = entityEventSnapshot.cddPersonData.activityCDD.accounts;
                                    $scope.accountgridOptions.api.onNewRows();
                                } else {
                                    $scope.accountgridOptions.rowData = "";
                                    $scope.accountgridOptions.api.onNewRows();
                                }

                                if (entityEventSnapshot.cddPersonData.activityCDD != undefined) {
                                    $scope.watchListGridOptions.rowData = entityEventSnapshot.cddPersonData.watchlistCDD.watchlistHits;
                                    $scope.watchListGridOptions.api.onNewRows();

                                    $scope.pepHitsGridOptions.rowData = entityEventSnapshot.cddPersonData.watchlistCDD.pepHits;
                                    $scope.pepHitsGridOptions.api.onNewRows();
                                } else {
                                    $scope.watchListGridOptions.rowData = "";
                                    $scope.watchListGridOptions.api.onNewRows();

                                    $scope.pepHitsGridOptions.rowData = "";
                                    $scope.pepHitsGridOptions.api.onNewRows();
                                }
                            } else {
                                $scope.accountgridOptions.rowData = "";
                                $scope.accountgridOptions.api.onNewRows();

                                $scope.watchListGridOptions.rowData = "";
                                $scope.watchListGridOptions.api.onNewRows();

                                $scope.pepHitsGridOptions.rowData = "";
                                $scope.pepHitsGridOptions.api.onNewRows();
                            }

                            //Negative news risk tab
                            var chartdata;
                            var negativeNewsData;
                            if (entityEventSnapshot.eddPersonData != undefined && entityEventSnapshot.eddPersonData.negativeNewsData != undefined) {
                                negativeNewsData = entityEventSnapshot.eddPersonData.negativeNewsData.articles;
                                chartdata = bindNegativeRiskChart(negativeNewsData);
                                $scope.adverseKeywordData = chartdata;

                                negativeNewsData = bindNegativeData(negativeNewsData, entityEventSnapshot.riskDNA);

                                $scope.negativeRiskGridOptions.rowData = negativeNewsData;
                                $scope.negativeRiskGridOptions.api.onNewRows();
                            } else {
                                negativeNewsData = [];
                                chartdata = bindNegativeRiskChart(negativeNewsData);
                                $scope.adverseKeywordData = chartdata;

                                $scope.negativeRiskGridOptions.rowData = "";
                                $scope.negativeRiskGridOptions.api.onNewRows();
                            }

                            //Activity Risk tab
                            var activityData = $scope.entityDetail.cddPersonData.activityCDD;
                            var activityDataArray = [];
                            var rowData;
                            angular.forEach(activityData, function (value, key) {
                                rowData = value;
                                if (key === 'alerts') {
                                    angular.forEach(rowData, function (values) {
                                        this.push({
                                            "id": values.id, "itemType": values.alertType,
                                            "item": "Alert", "accountNumber": values.transactions[0].accountNumber,
                                            "closedDate": values.alertDueDate, "status": values.alertStatus,
                                            "assignedAnalyst": values.entityName
                                        });
                                    }, activityDataArray);
                                } else if (key === 'cases') {
                                    angular.forEach(rowData, function (values) {
                                        this.push({
                                            "id": values.id, "itemType": values.caseType, "item": "Case",
                                            "accountNumber": values.transactions[0].accountNumber, "closedDate": values.caseDueDate,
                                            "status": values.caseStatus, "assignedAnalyst": values.entityName
                                        });
                                    }, activityDataArray);
                                }
                            });

                            $scope.activityRiskGridOptions.rowData = activityDataArray;
                            $scope.activityRiskGridOptions.api.onNewRows();

                            //TODO: Need to show network risk

                            //Hide Add/Edit/Delete buttons
                            jQuery(".selectorClass").hide();
                            jQuery(".addNewCard").hide();
                        }
                    }

                    angular.element('html,body').animate({
                        scrollTop: 0
                    }, 500);
                };

                // Initialize scroll for entity page
                globals.defaultVars.initScroll('.documentCenterS');

                globals.defaultVars.initScroll('.changeLogGrid');

                $scope.xAxisTickFormatFunction = function () {
                    return function (d) {
                        return d3.time.format('%x')(new Date(d));  //uncomment for date format
                    }
                }

                $scope.toolTipContentFunction = function () {
                    return function (key, x, y) {
                        return '<p>' + y + '% at ' + x + '</p>';
                    }
                }

                $scope.save = function () {
                    //alert("Work in progress...");
                    $scope.modifiedEntityJson = {};
                    $scope.modifiedEntityJson = $scope.dataObject;

                    //$scope.modifiedEntityJson.DocumentCenterGrid = $scope.DocumentCenterGrid.rowData;
                    //$scope.modifiedEntityJson.NotesGrid = $scope.NotesGrid.rowData;
                    //$scope.modifiedEntityJson.TasksGrid = $scope.TasksGrid.rowData;

                    //$scope.modifiedEntityJson.negativeRiskGridOptions = $scope.negativeRiskGridOptions.rowData;
                    //$scope.modifiedEntityJson.activityRiskGridOptions = $scope.activityRiskGridOptions.rowData;
                    //$scope.modifiedEntityJson.riskDnaLog = $scope.riskDnaLog;
                    //$scope.modifiedEntityJson.changeLogGridOptions = $scope.changeLogGridOptions.rowData;
                }

            }
        ]);
})();
