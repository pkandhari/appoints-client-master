angular.module('appoints.appointment', [
  'ngRoute'
])

  .controller('AppointmentCtrl', function AppointmentController($scope, _, flash, moment, config, $location, $routeParams, $http) {
    $scope.doctor = {};
    $scope.isreadonly = $routeParams.isreadonly === 'true';

    $scope.getEndTime = function (appointment) {
      return moment(appointment.dateAndTime).add(appointment.duration, 'minutes').format('H:mm');
    };

    $scope.updateAppointment = function () {
      $scope.editAppointment.doctorId = $scope.doctor.DoctorId;
      var reqURL = config.apiEndpoint + "/appointments";

      var req = {
        method: "PUT",
        url: reqURL,
        data: $scope.editAppointment
      };
      return $http(req)
        .then(function () {
          flash.add('Appointment updated successfully', 'info');
          $location.url('/dashboard');
        }, function (err) {
          flash.add(err.data.ExceptionMessage, 'error');
        });
    };

    $scope.getAppointment = function () {
      $scope.appointmentId = 1;
      var req = {
        method: "GET",
        url: config.apiEndpoint + "/appointments/" + $routeParams.appointmentid
      };
      return $http(req)
        .then(function (result) {
          $scope.editAppointment = result.data;
          $scope.editAppointment.DateAndTime = moment($scope.editAppointment.DateAndTime);
          $scope.doctor.DoctorId = $scope.editAppointment.DoctorId;
        }, function (err) {
          flash.add(err.data.ExceptionMessage, 'error');
        });
    };

    $scope.getDoctors = function () {
      var req = {
        method: "GET",
        url: config.apiEndpoint + "/doctors"
      };
      return $http(req)
        .then(function (result) {
          $scope.doctors = result.data;
        }, function (err) {
          flash.add(err.data.ExceptionMessage, 'error');
        });
    };

    $scope.goToDashboard = function () {
      $location.url('/dashboard');
    };

    $scope.getAppointment();
    $scope.getDoctors();
    // initAppointment();
  });