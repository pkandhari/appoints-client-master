angular.module('appoints.usersession', [
  'appoints.flash',
  'appoints.config'
])

  .factory('usersession', function ($rootScope, $window, config, flash, $http) {

    var defaultSession = {
      userId: '',
      displayName: '',
      isAuthenticated: false,
      isAdmin: false,
      isDoctor: false
    };

    function Session() {
      return angular.copy(defaultSession, this);
    }

    var currentSession = new Session();

    function login(loginObj) {
      var req = {
        method: "POST",
        url: config.apiEndpoint + "/login",
        data: loginObj
      };
      return $http(req)
        .then(function (result) {
          var userResource = result.data;
          if (userResource.UserId > 0) {
            currentSession.isAuthenticated = true;
            currentSession.userId = userResource.UserId;
            currentSession.displayName = userResource.DisplayName;
            currentSession.isAdmin = userResource.IsAdmin;
            currentSession.isDoctor = userResource.IsDoctor;
            $window.localStorage.setItem('access_token', JSON.stringify(userResource));
            $rootScope.$broadcast('event:loggedin', currentSession);
          }
        }, function (err) {
          flash.add(err.data.ExceptionMessage, 'error');
        });
    }

    function signup(signupObj) {
      var req = {
        method: "POST",
        url: config.apiEndpoint + "/signup",
        data: signupObj
      };
      return $http(req)
        .then(function (result) {
          return result;
        }, function (err) {
          flash.add(err.data.ExceptionMessage, 'error');
        });
    }

    function updatelogindetails(loginObj) {
      var req = {
        method: "PUT",
        url: config.apiEndpoint + "/login",
        data: loginObj
      };
      return $http(req)
        .then(function (result) {
          return result;
        }, function (err) {
          flash.add(err.data.ExceptionMessage, 'error');
        });
    }

    function logout() {
      $window.localStorage.removeItem('access_token');
      currentSession = new Session();
      $rootScope.$broadcast('event:loggedout', currentSession);
    }

    var returnTo = '';

    return {
      current: currentSession,
      login: login,
      signup: signup,
      updatelogindetails: updatelogindetails,
      logout: logout,
      returnTo: returnTo
    };
  })

  .run(function ($window, $rootScope, usersession) {
    // Automatically try to login the user when starting up this module
    if ($window.localStorage.getItem('access_token') !== null) {

      var userResource = JSON.parse($window.localStorage.getItem('access_token'));
      if (userResource.UserId > 0) {
        usersession.current.isAuthenticated = true;
        usersession.current.userId = userResource.UserId;
        usersession.current.displayName = userResource.DisplayName;
        usersession.current.isAdmin = userResource.IsAdmin;
        usersession.current.isDoctor = userResource.IsDoctor;
        $rootScope.$broadcast('event:loggedin', usersession.current);
      }
    }
  });