


//(function () {

//    'use strict';
//    angular
//        .module('myApp')
//    .cotroller('headerCtrl', ["$state", "$scope", "$stateParams", "$window", "authenticationSvc", function ($state, $scope, $stateParams, $window, authenticationSvc)
//    {
//        function upperCaseNewValueHandler(fName, lName)
//        {
//            //var data = params.toUpperCase();
//            //var spl = data.split(' ');
//            var finalVal = "";
//            finalVal = fName.toUpperCase().substr(0, 1);
//            finalVal += lName.toUpperCase().substr(0, 1);
//            //for (var i = 0; i < spl.length; i++) {
//            //    if (i == 2) break;
//            //    finalVal += spl[i].substr(0, 1);
//            //}
//            return finalVal;
//        }

//        var userInfo = authenticationSvc.getUserInfo();
//        var upperName = upperCaseNewValueHandler(userInfo.FName,userInfo.LName);
        
//        $scope.userInfo = userInfo;
//        $scope.ShortName = upperName;
//    }
//    ]);
//})();




(function () {
    'use strict';

    angular
        .module('myApp')
    .controller('headerCtrl', ["$state", "$scope", "$stateParams", "$window", "authenticationSvc", function ($state, $scope, $stateParams, $window, authenticationSvc) {
     
                function upperCaseNewValueHandler(fName, lName)
                {
                    //var data = params.toUpperCase();
                    //var spl = data.split(' ');
                    var finalVal = "";
                    finalVal = fName.toUpperCase().substr(0, 1);
                    finalVal += lName.toUpperCase().substr(0, 1);
                    //for (var i = 0; i < spl.length; i++) {
                    //    if (i == 2) break;
                    //    finalVal += spl[i].substr(0, 1);
                    //}
                    return finalVal;
                }


                var userInfo = authenticationSvc.getUserInfo();
                var upperName = upperCaseNewValueHandler(userInfo.FName,userInfo.LName);

                $scope.FullName = userInfo.FName+" "+ userInfo.LName;
                $scope.ShortName = upperName;

    }
    ]);
})();