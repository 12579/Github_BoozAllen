
var app = angular.module('myApp', ['ngRoute', 'angularGrid']);//, 'toaster'//'ngRoute' ,'ngAnimate', 'ngCookies'

app.factory("authenticationSvc", ["$http", "$q", "$window", function ($http, $q, $window) {
    var userInfo;

    function login(userName, password) {
        var deferred = $q.defer();

        var res = $http.get("../../../sampleJson/LoginDataJson.json");
        res.then(
            function (result) {
                if (result.data[0].UserName == userName && result.data[0].Password == password) {
                    userInfo =
                    {
                        accessToken: 'token', //result.data.access_token, Not defined
                        UserName: result.data[0].UserName,
                        ID: result.data[0].ID,
                        Email: result.data[0].Email,
                        ErrorMessage: ""
                    };
                    $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                    deferred.resolve(userInfo);
                }
                else {
                    userInfo =
                    {
                        ErrorMessage: "Invalid Credential"
                    };
                    deferred.resolve(userInfo);
                }
            },
            function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function logout()
    {
        var deferred = $q.defer();
        var serviceBase = 'http://localhost:50138/api/logout';
        $http({
            method: "POST",
            url: "/api/logout",
            //url:serviceBase,
            headers: {
                "access_token": userInfo.accessToken
            }
        })
        .then(function (result) {
            userInfo = null;
            $window.sessionStorage["userInfo"] = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function getUserInfo() {
        return userInfo;
    }

    function init() {
        if ($window.sessionStorage["userInfo"]) {
            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        }
    }
    init();

    return {
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
}]);


app.controller("LoginController", ["$scope", "$location", "$window", "authenticationSvc", function ($scope, $location, $window, authenticationSvc) {
    $scope.userInfo = null;

    $scope.login = function () {
        var userName = $scope.username;
        var password = $scope.password;

        if (userName == undefined) {
            $(".userEnter").show();
            $(".passwordEnter").hide();
            $(".user").hide();
            $(".LoginError").hide();
        }
        else if (userName == '') {
            $(".userEnter").show();
            $(".passwordEnter").hide();
            $(".user").hide();
            $(".LoginError").hide();
        }
        if (password == undefined) {
            $(".passwordEnter").show();
            $(".userEnter").hide();
            $(".user").hide();
            $(".LoginError").hide();
        }
        else if (password == '') {
            $(".passwordEnter").show();
            $(".userEnter").hide();
            $(".user").hide();
            $(".LoginError").hide();
        }
        else {
            authenticationSvc.login(userName, password)
                .then(
                function (result) {
                    if (result.ErrorMessage != '') {
                        $scope.ErrorMessage = "Invalid credentials old";
                        $(".userEnter").hide();
                        $(".passwordEnter").hide();
                        $(".LoginError").hide();
                        $(".user").show();
                    }
                    else {
                        $(".animatedImages").hide();
                        $("#mainDiv").removeClass();
                        $scope.userInfo = result;
                        $location.path("/dashboard");
                    }
                },
                function (error) {
                    $(".LoginError").show();

                });
        }
    };
}]);

app.controller("HomeController", ["$scope", "$location", "authenticationSvc", "auth", function ($scope, $location, authenticationSvc, auth) {
    $scope.userInfo = auth;

    $scope.logout = function () {
        authenticationSvc.logout()
            .then(function (result) {
                $scope.userInfo = null;
                $location.path("/login");
            }, function (error) {
                console.log(error);
            });
    };
}]);

app.controller("DashboardCtrl", function ($scope, $http) {
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