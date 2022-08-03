angular.module('appoints.logindetails', [
    'appoints.usersession',
    'appoints.flash',
    'ngRoute'
])

    .controller('LoginDetailsCtrl', function LoginDetailsController($scope, flash, $location, usersession) {

        $scope.updatelogindetails = function () {
            var loginObj = {};
            loginObj.userId = usersession.current.userId;
            loginObj.oldPassword = $scope.oldPassword;
            loginObj.newPassword = $scope.newPassword;
            usersession.updatelogindetails(loginObj)
                .then(function (result) {
                    if (result) {
                        if (usersession.returnTo) {
                            $location.url(usersession.returnTo);
                        }
                        else {
                            $location.url('/');
                        }
                    }
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };
    });