angular.module('appoints.login', [
  'appoints.config',
  'appoints.usersession',
  'ngRoute'
])

  .controller('LoginCtrl', function LoginController($scope, $rootScope, $window, $location, config, usersession) {

    usersession.returnTo = $location.search().returnTo;

    // $scope.loginGoogle = function () {
    //   return authWindow(config.defaultApiEndpoint + '/auth/google');
    // };

    // function authWindow(authUrl) {
    //   $rootScope.loginPopup = popupCenterWindow(authUrl, 'authenticate', 640, 500);
    //   return false;
    // }

    // function popupCenterWindow(url, title, w, h) {
    //   var left = (screen.width / 2) - (w / 2);
    //   var top = (screen.height / 2) - (h / 2);
    //   return $window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    //   return true;
    // }

  });
