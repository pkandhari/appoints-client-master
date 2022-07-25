angular.module('appoints.profile', [
    'appoints.config',
    'appoints.usersession'
])

    .controller('ProfileCtrl', function ProfileController($scope, $rootScope, $timeout, config, usersession, $http, $location, flash, $routeParams) {
        // var profileVM = this;
        $scope.isreadonly = $routeParams.isreadonly === 'true';
        $scope.dataLoading = true;

        $scope.getProfileData = function () {
            var reqURL = config.apiEndpoint;

            if ($scope.isreadonly) {
                if ($routeParams.isdoctor === 'true') {
                    reqURL = reqURL + "/doctors/" + $routeParams.userid;
                }
                else {
                    reqURL = reqURL + "/patients/" + $routeParams.userid;
                }
            }
            else {
                if (usersession.current.isAdmin) {
                    reqURL = reqURL + "/admins/" + usersession.current.userId;
                }
                else if (usersession.current.isDoctor) {
                    reqURL = reqURL + "/doctors/" + usersession.current.userId;
                }
                else {
                    reqURL = reqURL + "/patients/" + usersession.current.userId;
                }
            }

            var req = {
                method: "GET",
                url: reqURL
            };
            return $http(req)
                .then(function (result) {
                    $scope.dataLoading = false;
                    $scope.profileData = result.data;
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.goToDashboard = function () {
            $location.url('/dashboard');
        };

        $scope.getProfileData();
        // $timeout(function () {
        //     $scope.getProfileData(); // this is the called function
        //   }, 3000);
    });

