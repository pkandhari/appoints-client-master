angular.module('appoints.profile', [
    'appoints.config',
    'appoints.usersession'
])

    .controller('ProfileCtrl', function ProfileController($scope, moment, config, usersession, $http, $location, flash, $routeParams) {
        // var profileVM = this;
        $scope.isreadonly = $routeParams.isreadonly === 'true';
        $scope.maritalStatus = { Id: 0, Description: '' };
        $scope.gender = { Id: 0, Description: '' };

        $('#maritalStatus').attr("disabled",  $scope.isreadonly );
        $('#gender').attr("disabled",  $scope.isreadonly );

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
                    $scope.profileData = result.data;
                    $scope.maritalStatus.Id = $scope.profileData.UserDetails.MaritalStatus;
                    $scope.gender.Id = $scope.profileData.UserDetails.Gender;
                    if ($scope.profileData.DOJ) {
                        $scope.profileData.DOJ = moment($scope.profileData.DOJ).toDate();
                    }
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.saveProfileData = function () {
            var reqURL = config.apiEndpoint;

            if (usersession.current.isAdmin) {
                reqURL = reqURL + "/admins";
            }
            else if (usersession.current.isDoctor) {
                reqURL = reqURL + "/doctors";
            }
            else {
                reqURL = reqURL + "/patients";
            }

            $scope.profileData.UserDetails.MaritalStatus = $scope.maritalStatus.Id;
            $scope.profileData.UserDetails.Gender = $scope.gender.Id;

            var req = {
                method: "PUT",
                url: reqURL,
                data: $scope.profileData
            };
            return $http(req)
                .then(function () {
                    flash.add('Profile saved successfully', 'info');
                    $location.url('/dashboard');
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.getGenderData = function () {
            var req = {
                method: "GET",
                url: config.apiEndpoint + '/genders'
            };
            return $http(req)
                .then(function (result) {
                    $scope.gendersData = result.data;
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.getMaritalStatusData = function () {
            var req = {
                method: "GET",
                url: config.apiEndpoint + '/maritalstatus'
            };
            return $http(req)
                .then(function (result) {
                    $scope.maritalStatusData = result.data;
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.goToDashboard = function () {
            $location.url('/dashboard');
        };

        $scope.getProfileData();
        $scope.getGenderData();
        $scope.getMaritalStatusData();
    });

