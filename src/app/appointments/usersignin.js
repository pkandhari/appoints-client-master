angular.module('appoints.signin', [
  'ngRoute',
  'appoints.api'
])

  .controller('UserSigninCtrl', function UserSigninController($scope, $http, $window, _, appointsapi, flash, moment) {

    $scope.login = function () {
      var req = {
        method: "GET",
        url: "http://localhost/DocConnectAPI/api/values"
      };
      $http(req)
        .then(function mySuccess(response) {
          $scope.myWelcome = response.data;
        });
    };
  });