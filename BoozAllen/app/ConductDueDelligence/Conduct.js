var app = angular.module('conductApp', ['angularGrid']).controller('conductCtrl',
    function conductCtrl($scope, $http) {
      
        var columnDefs = [
         {
             headerName: "Account Details", field: "", width: 550, cellRenderer: function (params) {
                 return getAccountDetails(params);
             }
         },
         {
             headerName: "Opening Date", field: "accountOpenDate", width: 200
         },
         {
             headerName: "Relationship Manager", field: "relationshipManager", width: 200
         }
        ];

        function getAccountDetails(params) {

            var result = "<span><b>" + params.data.accountType + "</b><br />Account Number - " + params.data.accountID + "</span>";
            var assocdatas = params.data.accountBeneficiaries;
            result+="</br><div style='background-color:yellow;height:20px;width;950px;'>";
            for (var i = 0; i< assocdatas.length;i++)
             {
                var split = assocdatas[i].split(" - ");
                var shortname = split[0].split(" ");
                result += "<b>" + split[0] + "(" + shortname[0].substring(0, 1) + shortname[1].substring(0, 1) + ")" + "</b>&nbsp;&nbsp;" + split[1] + "&nbsp;&nbsp;";
            }
            result+="</div>";
            return result;
        }

        $scope.accountgridOptions = {
            columnDefs: columnDefs,
            rowData: null,
            rowHeight:70,
            angularCompileRows: true
           
        };
       
        $http.get("../../../sampleJson/caseObject.json").then(function (res) {

         $scope.accountgridOptions.rowData = res.data.cdd;
         $scope.accountgridOptions.api.onNewRows();


        });
  }
);