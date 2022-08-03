angular.module('appoints.signin', [
  'appoints.usersession',
  'appoints.flash',
  'ngRoute'
])

  .controller('UserSigninCtrl', function UserSigninController($scope, flash, $location, usersession) {
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