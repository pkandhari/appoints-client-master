angular.module('appoints.dashboard', [
    'appoints.config',
    'appoints.usersession'
])

    .controller('DashboardCtrl', function DashboardController($scope, config, usersession, $http, $location, flash) {
        $scope.user = usersession.current;
        $scope.getDoctors = function () {
            var reqURL = config.apiEndpoint + "/doctors";

            var req = {
                method: "GET",
                url: reqURL
            };
            return $http(req)
                .then(function (result) {
                    $scope.doctors = result.data;
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.getPatients = function () {
            var reqURL = config.apiEndpoint + "/patients";

            var req = {
                method: "GET",
                url: reqURL
            };
            return $http(req)
                .then(function (result) {
                    $scope.patients = result.data;
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.openDoctorDetails = function (doctor) {
            $location.url('/profile/true/true/' + doctor.UserDetails.UserId);
        };

        $scope.openPatientDetails = function (patient) {
            $location.url('/profile/true/false/' + patient.UserDetails.UserId);
        };

        $scope.getDoctors();
        $scope.getPatients();
    });

