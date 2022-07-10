angular.module('appoints', [
  'ngRoute',
  'ui.bootstrap.datetimepicker',
  'appoints.directives',
  'appoints.flash',
  'appoints.usersession',
  'appoints.authinterceptor',
  'appoints.home',
  'appoints.login',
  'appoints.signin',
  'appoints.signup',
  'appoints.profile',
  'appoints.appointments',
  'appoints-client-templates'
])

  // allow DI for use in controllers, unit tests
  .constant('_', window._)
  .constant('moment', window.moment)

  .config(function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

  .config(function config($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl',
        title: 'Home'
      })
      .when('/login', {
        templateUrl: 'auth/login.html',
        controller: 'LoginCtrl',
        title: 'Login'
      })
      .when('/appointments', {
        templateUrl: 'appointments/appointments.html',
        controller: 'AppointmentsCtrl',
        title: 'Appointments'
      })
      .when('/usersignin', {
        templateUrl: 'appointments/usersignin.html',
        controller: 'UserSigninCtrl',
        title: 'UserSignin'
      })
      .when('/usersignup', {
        templateUrl: 'appointments/usersignup.html',
        controller: 'UserSignupCtrl',
        title: 'UserSignup'
      })
      .when('/profile', {
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

    $scope.$on('event:loggedin', function (ev, currentSession) {
      $scope.user = currentSession;
      usersession.current = currentSession;
    });

    $scope.$on('event:loggedout', function (ev, currentSession) {
      $scope.user = currentSession;
      usersession.current = currentSession;
    });

  });