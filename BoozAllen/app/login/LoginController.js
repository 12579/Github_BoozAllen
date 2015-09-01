


var LoginController =
    function ($scope, $location, $window, LoginService) {
    //function($scope, $location, $window, authenticationSvc) {
        $scope.userInfo = null;

        //$scope.login = function() {
        //    authenticationSvc.login($scope.userName, $scope.password)
        //        .then(function(result) {
        //            $scope.userInfo = result;
        //            $location.path("/dashboard");
        //        }, function(error) {
        //            $window.alert("Invalid credentials");
        //            console.log(error);
        //        });
        //};

        $scope.cancel = function() {
            $scope.userName = "";
            $scope.password = "";
        };

        var setCookiesValues = function ()
        {
            //var userName = $cookieStore.get('userName');
            //var passWord = $cookieStore.get('passWord');
            //if (userName != undefined) {
            //    $scope.userName = userName;
            //}
            //if (passWord != undefined) {
            //    $scope.password = passWord;
            //}
        }

        var alertFunction = function() {
            alert('yes');
        }
        alertFunction();

        setCookiesValues();
    };
    
LoginController.$inject = ['$scope', '$location', '$window', 'LoginService'];
