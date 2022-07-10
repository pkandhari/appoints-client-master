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
      $window.localStorage.setItem('access_token', loginObj);
      // return appointsapi.apiRoot.then(function (rootResource) {
      //   return rootResource.$get('me').then(function (userResource) {
      //     currentSession.isAuthenticated = true;
      //     currentSession.userId = userResource.userId;
      //     currentSession.displayName = userResource.displayName;
      //     $rootScope.$broadcast('event:loggedin', currentSession);
      //   }, function (err) {
      //     flash.add(err.message, 'error');
      //   });
      // });

      var req = {
        method: "POST",
        url: config.apiEndpoint + "/api/login",
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

    function logout() {
      $window.localStorage.removeItem('access_token');
      currentSession = new Session();
      $rootScope.$broadcast('event:loggedout', currentSession);
    }

    var returnTo = '';

    return {
      current: currentSession,
      login: login,
      logout: logout,
      returnTo: returnTo
    };
  })

  .run(function ($window, $rootScope, $log, appointsapi, usersession) {
    // Automatically try to login the user when starting up this module
    // if ($window.localStorage.getItem('access_token') !== null) {
    //   appointsapi.apiRoot.then(function (rootResource) {
    //     rootResource.$get('me').then(function (userResource) {
    //       usersession.current.isAuthenticated = true;
    //       usersession.current.userId = userResource.userId;
    //       usersession.current.displayName = userResource.displayName;
    //       $rootScope.$broadcast('event:loggedin', usersession.current);
    //     }, function (err) {
    //       $log.info('Unable to login automatically: ' + err.message);
    //     });
    //   });
    // }

    // if ($window.localStorage.getItem('access_token') !== null) {
    //   var req = {
    //     method: "POST",
    //     url: config.apiEndpoint + "/api/login",
    //     data: loginObj
    //   };
    //   return $http(req)
    //     .then(function (result) {
    //       userResource = result.data;
    //       if (userResource.UserId > 0) {
    //         usersession.current.isAuthenticated = true;
    //         usersession.current.userId = userResource.UserId;
    //         usersession.current.displayName = userResource.DisplayName;
    //         $rootScope.$broadcast('event:loggedin', usersession.current);
    //       }
    //     }, function (err) {
    //       $log.info('Unable to login automatically: ' + err.message);
    //       flash.add('Unable to login automatically: ' + err.data.ExceptionMessage, 'error');
    //     });
    // }

  });