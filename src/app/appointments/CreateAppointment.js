angular.module('appoints.createappointment', [
    'ngRoute',
    'ui.calendar'
])

    .controller('CreateAppointmentCtrl', function CreateAppointmentController($scope, $compile, usersession, $timeout, $location, uiCalendarConfig, config, $http, _, flash, moment) {

        function initAppointment() {
            $scope.newAppointment = {
                title: '',
                dateAndTime: moment().startOf('day').add(1, 'days').add(9, 'hours').toDate(),
                duration: 30,
                remarks: ''
            };
            $scope.editAppointment = null;
        }

        initAppointment();

        // $scope.getEndTime = function (appointment) {
        //     return moment(appointment.dateAndTime).add(appointment.duration, 'minutes').format('H:mm');
        // };

        $scope.createAppointment = function () {
            $scope.newAppointment.patientId = usersession.current.userId;
            $scope.newAppointment.doctorId = $scope.doctor.DoctorId;
            var reqURL = config.apiEndpoint + "/appointments";

            var req = {
                method: "POST",
                url: reqURL,
                data: $scope.newAppointment
            };
            return $http(req)
                .then(function () {
                    flash.add('Appointment created successfully', 'info');
                    $location.url('/dashboard');
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

        $scope.getAppointments = function () {
            $scope.calEventsExt.events = [];
            var reqURL = config.apiEndpoint + "/doctors/" + $scope.doctor.UserDetails.UserId + "/appointments";

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

        $scope.addEvent = function (appointment) {
            $scope.calEventsExt.events.push(appointment);
        };

        $scope.calEventsExt = {
            // color: '#f00',
            // textColor: 'yellow',
            events: [
                // { type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
                // { type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 15, 0), end: new Date(y, m, d, 17, 0), allDay: false },
                // { type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
            ]
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

        $scope.optionChange = function () {
            $scope.getAppointments();
        };

        /* event sources array*/
        $scope.eventSources = [$scope.calEventsExt];

        $scope.getDoctors();
    });