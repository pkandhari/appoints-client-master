angular.module('appoints.usersession', [
  'appoints.flash',
  'appoints.config'
])

  .factory('usersession', function ($rootScope, $window, config, flash, $http, Base64) {

    var defaultSession = {
      userId: '',
      displayName: '',
      isAuthenticated: false,
      isAdmin: false,
      isDoctor: false,
      authdata: ''
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
            currentSession.authdata = Base64.encode(loginObj.username + ':' + loginObj.password);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + currentSession.authdata;
            $window.localStorage.setItem('access_token', JSON.stringify(currentSession));
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

  .run(function ($window, $rootScope, usersession, $http) {
    // Automatically try to login the user when starting up this module
    if ($window.localStorage.getItem('access_token') !== null) {
      var userResource = JSON.parse($window.localStorage.getItem('access_token'));
      if (userResource.userId > 0) {
        usersession.current= userResource;
        $http.defaults.headers.common['Authorization'] = 'Basic ' + userResource.authdata;
        $rootScope.$broadcast('event:loggedin', usersession.current);
      }
    }
  })

  .factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
      encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }

          output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
      },

      decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
          window.alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
          }

          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
      }
    };

    /* jshint ignore:end */
  });