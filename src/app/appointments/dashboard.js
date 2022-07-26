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
                .then(function (appointments) {
                    $scope.upcomingAdminAppointments = _.filter(appointments.data, function (appointment) {
                        return moment(appointment.DateAndTime) > moment();
                    });
                    $scope.pastAdminAppointments = _.filter(appointments.data, function (appointment) {
                        return moment(appointment.DateAndTime) <= moment();
                    });
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
                    $scope.upcomingDoctorAppointments = _.filter(appointments.data, function (appointment) {
                        appointment.title = appointment.Title;
                        appointment.start = moment(appointment.DateAndTime);
                        appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
                        appointment.allDay = false;
                        return moment(appointment.DateAndTime) > moment();
                    });
                    $scope.pastDoctorAppointments = _.filter(appointments.data, function (appointment) {
                        appointment.title = appointment.Title;
                        appointment.start = moment(appointment.DateAndTime);
                        appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
                        appointment.allDay = false;
                        $scope.addEventDoc(appointment);
                        return moment(appointment.DateAndTime) <= moment();
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
                    $scope.upcomingPatientAppointments = _.filter(appointments.data, function (appointment) {
                        appointment.title = appointment.Title;
                        appointment.start = moment(appointment.DateAndTime);
                        appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
                        appointment.allDay = false;
                        return moment(appointment.DateAndTime) > moment();
                    });
                    $scope.pastPatientAppointments = _.filter(appointments.data, function (appointment) {
                        appointment.title = appointment.Title;
                        appointment.start = moment(appointment.DateAndTime);
                        appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
                        appointment.allDay = false;
                        $scope.addEventPat(appointment);
                        return moment(appointment.DateAndTime) <= moment();
                    });
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.deleteAppointment = function (appointment) {
            var req = {
                method: "DELETE",
                url: config.apiEndpoint + "/appointments/" + appointment.AppointmentId
            };
            return $http(req)
                .then(function () {
                    
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

        $scope.openAppointment = function (appointment) {
            if (moment(appointment.DateAndTime) <= moment()) {
                $location.url('/appointment/true/' + appointment.AppointmentId);
            }
            else {
                $location.url('/appointment/false/' + appointment.AppointmentId);
            }
        };

        $scope.openAppointmentDoctor = function (appointment) {
            $location.url('/profile/true/true/' + appointment.DoctorUserId);
        };

        $scope.openAppointmentPatient = function (appointment) {
            $location.url('/profile/true/false/' + appointment.PatientUserId);
        };

        if (usersession.current.isAdmin) {
            $scope.getDoctors();
            $scope.getPatients();
            $scope.getAppointments();
        }
        else if (usersession.current.isDoctor) {
            $scope.getDoctorAppointments();
        }
        else {
            $scope.getPatientAppointments();
        }

        /* eventClick */
        $scope.eventClick = function (appointment) {
            if (moment(appointment.DateAndTime) <= moment()) {
                $location.url('/appointment/true/' + appointment.AppointmentId);
            }
            else {
                $location.url('/appointment/false/' + appointment.AppointmentId);
            }
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
                eventClick: $scope.eventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };
    });

