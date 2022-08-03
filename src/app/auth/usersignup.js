angular.module('appoints.signup', [
    'ngRoute'
])

    .controller('UserSignupCtrl', function UserSignupController($scope, usersession, $location) {
        $scope.signupObj = {
            'email': '',
            'firstName': '',
            'lastName': '',
            'username': '',
            'password': '',
            'isPractitioner': false,
            'specialty': '',
            'credentials': '',
        };

        $scope.signup = function () {
            if ($scope.signupObj.isPractitioner) {
                $scope.signupObj.firstName = 'Dr. ' + $scope.signupObj.firstName;
            }
            usersession.signup($scope.signupObj)
                .then(function (result) {
                    var userResource = result.data;
                    if (userResource.UserId > 0) {
                        $location.url('/usersignin');
                    }
                });
        };
    });