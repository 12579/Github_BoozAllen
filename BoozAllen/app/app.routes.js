
//var appConfig=
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
          .otherwise({
              redirectTo: '/login'
          });
      }
]);