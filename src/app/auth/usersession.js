angular.module('appoints.usersession', [
  'appoints.api',
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
      // always start with a default instance.
      return angular.copy(defaultSession, this);
    }

    var currentSession = new Session();

    function login(loginObj) {
      // Authenticate the user from the given authorization token
      $window.localStorage.setItem('access_token', loginObj.username + '~' + loginObj.userPassword);

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
            $rootScope.$broadcast('event:loggedin', currentSession);
          }
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
      updatelogindetails: updatelogindetails,
      logout: logout,
      returnTo: returnTo
    };
  })

  .run(function ($window, $rootScope, $log, usersession, config, flash, $http) {
    // Automatically try to login the user when starting up this module
    if ($window.localStorage.getItem('access_token') !== null) {
      var loginObj = {
        'username': $window.localStorage.getItem('access_token').split('~')[0],
        'userPassword': $window.localStorage.getItem('access_token').split('~')[1]
      };
      var req = {
        method: "POST",
        url: config.apiEndpoint + "/login",
        data: loginObj
      };
      return $http(req)
        .then(function (result) {
          userResource = result.data;
          if (userResource.UserId > 0) {
            usersession.current.isAuthenticated = true;
            usersession.current.userId = userResource.UserId;
            usersession.current.displayName = userResource.DisplayName;
            $rootScope.$broadcast('event:loggedin', usersession.current);
          }
        }, function (err) {
          $log.info('Unable to login automatically: ' + err.message);
          flash.add('Unable to login automatically: ' + err.data.ExceptionMessage, 'error');
        });
    }
  });