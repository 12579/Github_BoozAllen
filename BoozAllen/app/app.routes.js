
app.config(['$routeProvider',
      function ($routeProvider) {
          $routeProvider
              .when('/login', {
                  title: 'Login',
                  templateUrl: 'app/login/LoginView.html',
                  controller: 'LoginController'
              })
              .when('/',
              {
                  title: 'Login',
                  templateUrl: 'app/login/LoginView.html',
                  controller: 'LoginController',
                  role: '0'
              })
              .when('/logout', {
                  title: 'Logout',
                  templateUrl: 'app/login/LoginView.html',
                  controller: 'LoginController'
              })
              .when('/dashboard', {
                  title: 'Dashboard',
                  templateUrl: 'app/components/dashboard/dashboardViewNew.html',
                  controller: 'DashboardCtrl',
                  resolve:
                  {
                      auth: function ($q, authenticationSvc) {
                          var userInfo = authenticationSvc.getUserInfo();
                          if (userInfo) {
                              return $q.when(userInfo);
                          }
                          else {
                              return $q.reject({ authenticated: false });
                          }
                      }
                  }
              })
              .when('/managerDashboard', {
                  title: 'Dashboard',
                  templateUrl: 'app/components/managerDashboard/managerDashboardView.html',
                  controller: 'ManagerDashboardCtrl',
                  resolve:
                  {
                      auth: function ($q, authenticationSvc) {
                          var userInfo = authenticationSvc.getUserInfo();
                          if (userInfo) {
                              return $q.when(userInfo);
                          }
                          else {
                              return $q.reject({ authenticated: false });
                          }
                      }
                  }
              })
          .when('/adminDashboard', {
              title: 'Dashboard',
              templateUrl: 'app/components/AdminDashboard/adminDashboardView.html',
              controller: 'ManagerDashboardCtrl',
              resolve:
              {
                  auth: function ($q, authenticationSvc) {
                      var userInfo = authenticationSvc.getUserInfo();
                      if (userInfo) {
                          return $q.when(userInfo);
                      }
                      else {
                          return $q.reject({ authenticated: false });
                      }
                  }
              }
          })
          .otherwise({
              redirectTo: '/login'
          });
      }
]);

//app.config(function($stateProvider, $urlRouterProvider) {

//    //$urlRouterProvider.otherwise('/');
//    $urlRouterProvider.otherwise("/login");

//    $stateProvider
//        .state('index',
//        {
//            url: "/",
//            title: "Login",
//            templateUrl: "app/login/LoginView.html",
//            controller: "LoginController"
//            //views: {
//            //    '@' : {
//            //        templateUrl: 'layout.html',
//            //        controller: 'IndexCtrl'
//            //    },
//            //    'top@index' : { templateUrl: 'tpl.top.html',},
//            //    'left@index' : { templateUrl: 'tpl.left.html',},
//            //    'main@index' : { templateUrl: 'tpl.main.html',},
//            //},
//        })
//        .state('login', {
//            url: "/login",
//            templateUrl: "app/login/LoginView.html"
//        })
//    //.state('index.list',
//    //{
//    //    url: '/list',
//    //    templateUrl: 'list.html',
//    //    controller: 'ListCtrl'
//    //})
//    //.state('index.list.detail',
//    //{
//    //    url: '/:id',
//    //    views: {
//    //        'detail@index' : {
//    //            templateUrl: 'detail.html',
//    //            controller: 'DetailCtrl'
//    //        },
//    //    },
//    //})

//    // this definition switches the targets
//    //.state('index.list2',
//    //{
//    //    url: '/list2',
//    //    views: {
//    //        'detail@index' : {
//    //            templateUrl: 'list2.html',
//    //            controller: 'ListCtrl'
//    //        },
//    //    },
//    //})
//    //.state('index.list2.detail',
//    //{
//    //    url: '/:id',
//    //    views: {
//    //        '@index' : {
//    //            templateUrl: 'detail.html',
//    //            controller: 'DetailCtrl'
//    //        },
//    //        'list2detailtip' : {
//    //            template: '<div>current selection is {{id}}</div>',
//    //            controller: 'DetailCtrl'
//    //        },
//    //    },
//    //})
//});
////.controller('LoginController', function () { })
////.controller('ListCtrl', function(){})
////.controller('DetailCtrl', function($scope,$stateParams){$scope.id = $stateParams.id;})