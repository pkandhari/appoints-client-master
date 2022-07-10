angular.module('appoints.signin', [
  'appoints.api',
  'appoints.config',
  'appoints.usersession',
  'appoints.flash',
  'ngRoute'
])

  .controller('UserSigninCtrl', function UserSigninController($scope, flash, $http, $window, $rootScope, $location, config, usersession) {

    $scope.login = function () {
      var loginObj = {};
      loginObj.username = $scope.username;
      loginObj.userPassword = $scope.password;
      usersession.login(loginObj)
        .then(function () {
          if (usersession.current.isAuthenticated) {
            if (usersession.returnTo) {
              $location.url(usersession.returnTo);
            }
            else {
              $location.url('/');
            }
          }
          else {
            flash.add('Invalid username or password.', 'error')
          }
        });






      // var req = {
      //   method: "GET",
      //   url: "http://localhost/DocConnectAPI/api/values"
      // };
      // $http(req)
      //   .then(function mySuccess(response) {
      //     $scope.myWelcome = response.data;
      //   });
    };
  });