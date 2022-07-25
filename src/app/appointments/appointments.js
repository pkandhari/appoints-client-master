angular.module('appoints.appointments', [
  'ngRoute'
])

  .controller('AppointmentsCtrl', function AppointmentsController($scope, $window, _, flash, moment) {

    function initAppointment() {
      $scope.newAppointment = {
        title: '',
        dateAndTime: moment().startOf('day').add(1, 'days').add(9, 'hours').toDate(),
        duration: 30,
        remarks: ''
      };
      $scope.editAppointment = null;
    }

    $scope.getEndTime = function (appointment) {
      return moment(appointment.dateAndTime).add(appointment.duration, 'minutes').format('H:mm');
    };

    $scope.createAppointment = function () {
      // Sync endDateAndTime first
      $scope.newAppointment.endDateAndTime = moment($scope.newAppointment.dateAndTime).add($scope.newAppointment.duration, 'minutes');
      // return rootResource.$post('appointments', null, $scope.newAppointment).then(function () {
      //   flash.add('Appointment created successfully', 'info');
      //   initAppointment();
      // }, function (err) {
      //   flash.addError(err.data);
      // });

    };

    $scope.setAppointmentForEdit = function (appointment) {
      $scope.editAppointment = angular.copy(appointment);
    };

    initAppointment();
  });