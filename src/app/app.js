angular.module('appoints', [
  'ngRoute',
  'ui.bootstrap.datetimepicker',
  'appoints.directives',
  'appoints.flash',
  'appoints.usersession',
  'appoints.home',
  'appoints.signin',
  'appoints.logindetails',
  'appoints.signup',
  'appoints.dashboard',
  'appoints.profile',
  'appoints.createappointment',
  'appoints.appointment',
  'appoints-client-templates',
  'mdo-angular-cryptography'
])

  // allow DI for use in controllers, unit tests
  .constant('_', window._)
  .constant('moment', window.moment)

  .config(function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

  .config(function ($cryptoProvider) {
    $cryptoProvider.setCryptographyKey('123456');
  })

  .config(function config($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl',
        title: 'Home'
      })
      .when('/appointment/:isreadonly/:appointmentid', {
        templateUrl: 'appointments/appointment.html',
        controller: 'AppointmentCtrl',
        title: 'Appointment'
      })
      .when('/usersignin', {
        templateUrl: 'auth/usersignin.html',
        controller: 'UserSigninCtrl',
        title: 'UserSignin'
      })
      .when('/usersignup', {
        templateUrl: 'auth/usersignup.html',
        controller: 'UserSignupCtrl',
        title: 'UserSignup'
      })
      .when('/logindetails', {
        templateUrl: 'auth/logindetails.html',
        controller: 'LoginDetailsCtrl',
        title: 'LoginDetails'
      })
      .when('/dashboard', {
        templateUrl: 'appointments/dashboard.html',
        controller: 'DashboardCtrl',
        title: 'Dashboard'
      })
      .when('/createappointment', {
        templateUrl: 'appointments/CreateAppointment.html',
        controller: 'CreateAppointmentCtrl',
        title: 'CreateAppointment'
      })
      .when('/profile/:isreadonly/:isdoctor/:userid', {
        templateUrl: 'appointments/profile.html',
        controller: 'ProfileCtrl',
        title: 'Profile'
      });
  })

  .controller('AppCtrl', function AppController($scope, $location, usersession) {
    var defaultPageTitle = 'Appoints';

    $scope.pageTitle = defaultPageTitle;

    $scope.$on('$routeChangeSuccess', function (ev, currentRoute) {
      if (angular.isUndefined) {
        $scope.pageTitle = defaultPageTitle;
      }
      else {
        $scope.pageTitle = currentRoute.title || defaultPageTitle;
      }
    });

    $scope.user = usersession.current;

    $scope.routeIs = function (routeName) {
      return $location.path() === routeName;
    };

    $scope.logout = function () {
      usersession.logout();
      $location.url('/');
    };

    $scope.goToDashboard = function () {
      if ($scope.user.isAuthenticated) {
        $location.url('/dashboard');
      }
      else {
        $location.url('/');
      }
    };

    $scope.$on('event:loggedin', function (ev, currentSession) {
      $scope.user = currentSession;
      usersession.current = currentSession;
    });

    $scope.$on('event:loggedout', function (ev, currentSession) {
      $scope.user = currentSession;
      usersession.current = currentSession;
    });

  });