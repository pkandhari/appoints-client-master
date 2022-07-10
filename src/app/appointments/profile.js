angular.module('appoints.profile', [
    'appoints.config',
    'appoints.usersession'
])

    .controller('ProfileCtrl', function ProfileController($scope, config, usersession, $http, flash) {
        // var profileVM = this;
        $scope.dataLoading = true;

        $scope.getProfileData = function () {
            var reqURL = config.apiEndpoint;

            if (usersession.current.isAdmin)
                reqURL = reqURL + "/admins/" + usersession.current.userId;
            else if (usersession.current.isDoctor)
                reqURL = reqURL + "/doctors/" + usersession.current.userId;
            else
                reqURL = reqURL + "/patients/" + usersession.current.userId;

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

        $scope.getProfileData();
    });

