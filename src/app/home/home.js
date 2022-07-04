angular.module('appoints.home', [
  'appoints.config',
  'ngRoute'
])



.controller('HomeCtrl', function HomeController($scope, appVersion) {
  $scope.version = appVersion;
});