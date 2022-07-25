angular.module('appoints.dashboard', [
    'appoints.config',
    'appoints.usersession'
])

    .controller('DashboardCtrl', function DashboardController($scope, $compile, $timeout, uiCalendarConfig, config, usersession, $http, $location, flash, _, moment) {
        $scope.user = usersession.current;
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

        $scope.getPatients = function () {
            var req = {
                method: "GET",
                url: config.apiEndpoint + "/patients"
            };
            return $http(req)
                .then(function (result) {
                    $scope.patients = result.data;
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.getAppointments = function () {
            var req = {
                method: "GET",
                url: config.apiEndpoint + "/appointments"
            };
            return $http(req)
                .then(function (result) {
                    $scope.appointments = result.data;
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.getDoctorAppointments = function () {
            var req = {
                method: "GET",
                url: config.apiEndpoint + "/doctors/" + usersession.current.userId + "/appointments"
            };
            return $http(req)
                .then(function (appointments) {
                    $scope.eventSourceDoctor = _.filter(appointments.data, function (appointment) {
                        appointment.title = appointment.Title;
                        appointment.start = moment(appointment.DateAndTime);
                        appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
                        appointment.allDay = false;
                        $scope.addEventDoc(appointment);
                        return appointment;
                    });
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.getPatientAppointments = function () {
            var req = {
                method: "GET",
                url: config.apiEndpoint + "/patients/" + usersession.current.userId + "/appointments"
            };
            return $http(req)
                .then(function (appointments) {
                    $scope.eventSourcePatient = _.filter(appointments.data, function (appointment) {
                        appointment.title = appointment.Title;
                        appointment.start = moment(appointment.DateAndTime);
                        appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
                        appointment.allDay = false;
                        $scope.addEventPat(appointment);
                        return appointment;
                    });
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.addEvent = function (appointment) {
            $scope.calEventsExt.events.push(appointment);
        };
        $scope.addEventDoc = function (appointment) {
            $scope.calEventsDoc.events.push(appointment);
        };
        $scope.addEventPat = function (appointment) {
            $scope.calEventsPat.events.push(appointment);
        };

        $scope.calEventsExt = {
            events: []
        };
        $scope.calEventsDoc = {
            events: []
        };
        $scope.calEventsPat = {
            events: []
        };
        
        $scope.eventSources = [$scope.calEventsExt];
        $scope.eventSourceDoctor = [$scope.calEventsDoc];
        $scope.eventSourcePatient = [$scope.calEventsPat];

        $scope.openDoctorDetails = function (doctor) {
            $location.url('/profile/true/true/' + doctor.UserDetails.UserId);
        };

        $scope.openPatientDetails = function (patient) {
            $location.url('/profile/true/false/' + patient.UserDetails.UserId);
        };

        $scope.openAppointmentDoctor = function (appointment) {
            $location.url('/profile/true/true/' + appointment.DoctorUserId);
        };

        $scope.openAppointmentPatient = function (appointment) {
            $location.url('/profile/true/false/' + appointment.PatientUserId);
        };

        $scope.getDoctors();
        $scope.getPatients();
        $scope.getAppointments();
        $scope.getDoctorAppointments();
        $scope.getPatientAppointments();




        $scope.getAppointments = function () {
            $scope.calEventsExt.events = [];
            $scope.newAppointment.doctorId = 1;
            var reqURL = config.apiEndpoint + "/doctors/" + $scope.newAppointment.doctorId + "/appointments";

            var req = {
                method: "GET",
                url: reqURL
            };
            return $http(req)
                .then(function (appointments) {
                    $scope.eventSources3 = _.filter(appointments.data, function (appointment) {
                        appointment.title = appointment.Title;
                        appointment.start = moment(appointment.DateAndTime);
                        appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
                        appointment.allDay = false;
                        $scope.addEvent(appointment);
                        return appointment;
                    });
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        /* alert on eventClick */
        $scope.alertOnEventClick = function (date) {
            $scope.alertMessage = (date.title + ' was clicked ');
        };

        /* Change View */
        $scope.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };

        /* Change View */
        $scope.renderCalendar = function (calendar) {
            $timeout(function () {
                if (uiCalendarConfig.calendars[calendar]) {
                    uiCalendarConfig.calendars[calendar].fullCalendar('render');
                }
            });
        };
        /* Render Tooltip */
        $scope.eventRender = function (event, element) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: false,
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };
    });

