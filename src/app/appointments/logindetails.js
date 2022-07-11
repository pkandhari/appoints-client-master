angular.module('appoints.logindetails', [
    'appoints.api',
    'appoints.config',
    'appoints.usersession',
    'appoints.flash',
    'ngRoute'
])

    .controller('LoginDetailsCtrl', function LoginDetailsController($scope, flash, $http, $window, $rootScope, $location, config, usersession) {

        $scope.updatelogindetails = function () {
            var loginObj = {};
            loginObj.userId = usersession.current.userId;
            loginObj.oldPassword = $scope.oldPassword;
            loginObj.newPassword = $scope.newPassword;
            usersession.updatelogindetails(loginObj)
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
        };
    });