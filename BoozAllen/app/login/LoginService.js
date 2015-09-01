
var LoginService = function ($http, $q, $window)
{
    return function (user, password)
    {
        var deferredObject = $q.defer();

        var userInfo =
        {
            "UserName": user,
            "password": password,
            "IsActive": true
        }

        var req = {
            method: 'GET',
            url: 'http://localhost:3442/api/UserInfo',
            data: { userName: user, pass: password }
        }
        var res = $http(req);
        res.success(function(response) {
            deferredObject.resolve(response);
        });
        res.error(function (response) {
            deferredObject.reject(response);
        });
        return deferredObject.promise;
    }
}

LoginService.$inject = ['$http', '$q'];