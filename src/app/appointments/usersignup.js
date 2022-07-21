angular.module('appoints.signup', [
    'ngRoute',
    'appoints.api'
])

    .controller('UserSignupCtrl', function UserSignupController($scope,usersession, $location) {
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
            usersession.signup($scope.signupObj)
                .then(function (result) {
                    var userResource = result.data;
                    if (userResource.UserId > 0) {
                        $location.url('/usersignin');
                    }
                });
        };
    });