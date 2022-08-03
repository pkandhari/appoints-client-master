angular.module('appoints.home', [
  'appoints.config',
  'ngRoute'
])

  .controller('HomeCtrl', function HomeController($scope, appVersion, flash, $location, usersession) {
    $scope.version = appVersion;
    $scope.showPassword = false;

    $scope.toggleShowPassword = function () {
      $scope.showPassword = !$scope.showPassword;
    };

    $scope.login = function () {
      var loginObj = {};
      loginObj.username = $scope.username;
      loginObj.password = $scope.password;
      usersession.login(loginObj)
        .then(function () {
          if (usersession.current.isAuthenticated) {
            if (usersession.returnTo) {
              $location.url(usersession.returnTo);
            }
            else {
              $location.url('/dashboard');
            }
          }
          else {
            flash.add('Invalid username or password.', 'error');
          }
        });
    };
  });