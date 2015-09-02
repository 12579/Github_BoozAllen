(function ()
{
    var myApp = angular.module('myApp', ['oci.treeview', 'ngRoute']);

    myApp.config(['$routeProvider',
function ($routeProvider) {
    "use strict";
    $routeProvider.
    when('/login', {
        title: 'Login',
        templateUrl: 'partials/login.html',
        controller: 'authCtrl'
    })
        .when('/logout', {
            title: 'Logout',
            templateUrl: 'partials/login.html',
            controller: 'logoutCtrl'
        })
        .when('/signup', {
            title: 'Signup',
            templateUrl: 'partials/signup.html',
            controller: 'authCtrl'
        })
        .when('/Dashboard', {
            title: "Dashboard",
            templateUrl: '../dashboard/dashboardView.html',
            controller: 'AppCtrl'
        })
        .when('/Grandchild3.1', {
            title: 'Grandchild3.1',
            templateUrl: 'partials/Grandchild3.1.html',
            controller: 'AppCtrl',
            role: '0'
        });

}
    ]);

    myApp.controller('AppCtrl', function ($scope, $location, $http) {

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
    });

})();

!function () {
    var a = angular.module("oci.treeview", []);
    a.controller("oci.treeview.ctrl", ["$scope",
        function (a) {
            function b(c) {
                "collapsed" !== a.defaultNodeState && (a.defaultNodeState = "expanded"),
                    c && void 0 === c.state && (c.children && c.children.length > 0 ? (c.state = a.defaultNodeState, c.children.forEach(b)) : c.state = "leaf");
            }

            b(a.tree),
                a.context = a.context || {},
                a.selectNode = function(b) {
                    function c() {
                        "expanded" === b.state ? b.state = "collapsed" : "collapsed" === b.state && (b.state = "expanded");


                    }

                    a.$emit("nodeSelected", b, a.context);
                    var d = a.onSelectNode && a.onSelectNode(b);
                    d && d.then ? d.then(c) : c();

                }, "false" !== a.selectTranscluded && (a.clickOnTranscluded = !0);
        }]),
    a.directive("oci.treeview", ["$compile", function (a) {
        return {
            restrict: "E", transclude: !0, scope: { tree: "=", context: "=?", onSelectNode: "=?", defaultNodeState: "@", selectTranscluded: "@" }, controller: "oci.treeview.ctrl",
            template: '<div class="tree"> <span ng-click="clickOnTranscluded && selectNode(tree)" ng-transclude ></span>   '
                + '<ul ng-if="tree.state === \'expanded\'">       '
                + '<li ng-repeat="node in tree.children">           '
                + '<i ng-class="node.state" ng-click="selectNode(node)"></i>           '
                + '<oci.treeview tree="node" context="context" on-select-node="onSelectNode" select-transcluded="{{selectTranscluded}}" '
            + 'default-node-state="{{defaultNodeState}}">               <span ng-transclude></span>           </oci.treeview>       </li>   </ul></div>',
            compile: function (b, c, d) { var e, f = b.contents().remove(); return function (b, c) { e || (e = a(f, d)), e(b, function (a) { c.append(a) }) } }
        }
    }])
}();