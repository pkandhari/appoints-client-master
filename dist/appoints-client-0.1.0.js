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
(function(module) {
try {
  module = angular.module('appoints-client-templates');
} catch (e) {
  module = angular.module('appoints-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('appointments/appointment.html',
    '<div ng-app="appoints" class="row"><div style="font-size: larger;padding-left: 1%"><a class="dropdown-toggle" role="button" title="Go to Dashboard" id="patient{{$index}}" href="" ng-click="goToDashboard()"><span class="glyphicon glyphicon-circle-arrow-left"></span>Go to dashboard</a></div><div class="col-md-6"><h2 style="text-align: center"><b>Appointment Details</b></h2><form role="form" name="form"><div class="form-group"><label for="doctor">Doctor</label><span class="mandatoryField" style="color: red">*</span><select class="form-control" id="doctor" ng-readonly="{{isreadonly}}" ng-options="doctor as doctor.UserDetails.FirstName for doctor in doctors track by doctor.DoctorId" ng-model="doctor" ng-change="optionChange()" required><option value="" disabled selected>Select your option</option></select></div><div class="form-group"><label for="title">Title</label><span class="mandatoryField" style="color: red">*</span> <input class="form-control" id="title" placeholder="Enter appointment description" ng-model="editAppointment.Title" ng-readonly="{{isreadonly}}" required></div><div class="form-group"><label for="dateAndTime">Appointment date and time</label><span class="mandatoryField" style="color: red">*</span><div class="dropdown"><a class="dropdown-toggle" id="dropdown1" role="button" data-toggle="dropdown"><div class="input-group"><input required data-date-time-input="MM/DD/YYYY HH:mm:ss" class="form-control" data-ng-model="editAppointment.DateAndTime" ng-readonly="{{isreadonly}}" required> <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><datetimepicker data-ng-model="editAppointment.DateAndTime" ng-readonly="{{isreadonly}}" data-datetimepicker-config="{ dropdownSelector: \'#dropdown1\', startView: \'hour\', minuteStep: 15 }"></datetimepicker></ul></div></div><div class="form-group"><label for="duration">Duration</label><span class="mandatoryField" style="color: red">*</span><select class="form-control" id="duration" ng-model="editAppointment.Duration" ng-readonly="{{isreadonly}}" required><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option></select></div><div class="form-group"><label for="remarks">Remarks</label><textarea id="remarks" class="form-control" rows="4" placeholder="Enter additional remarks" ng-model="editAppointment.Remarks"></textarea></div><button type="submit" class="btn btn-default" ng-click="updateAppointment()" ng-disabled="form.$invalid">Submit</button></form></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('appoints-client-templates');
} catch (e) {
  module = angular.module('appoints-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('appointments/CreateAppointment.html',
    '<div id="example" ng-app="appoints"><div class="col-md-4"><h2 style="text-align: center"><b>Create new appointment</b></h2><form role="form" name="form"><div class="form-group"><label for="doctor">Doctor</label><span class="mandatoryField" style="color: red">*</span><select class="form-control" id="doctor" ng-options="doctor as doctor.UserDetails.FirstName for doctor in doctors track by doctor.DoctorId" ng-model="doctor" ng-change="optionChange()" required><option value="" disabled selected>Select your option</option></select></div><div class="form-group"><label for="title">Title</label><span class="mandatoryField" style="color: red">*</span> <input class="form-control" id="title" placeholder="Enter appointment description" ng-model="newAppointment.title" required></div><div class="form-group"><label for="dateAndTime">Appointment date and time</label><span class="mandatoryField" style="color: red">*</span><div class="dropdown"><a class="dropdown-toggle" id="dropdown1" role="button" data-toggle="dropdown"><div class="input-group"><input required data-date-time-input="MM/DD/YYYY HH:mm:ss" class="form-control" data-ng-model="newAppointment.dateAndTime" required> <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><datetimepicker data-ng-model="newAppointment.dateAndTime" data-datetimepicker-config="{ dropdownSelector: \'#dropdown1\', startView: \'hour\', minuteStep: 15 }"></datetimepicker></ul></div></div><div class="form-group"><label for="duration">Duration</label><span class="mandatoryField" style="color: red">*</span><select class="form-control" id="duration" ng-model="newAppointment.duration" required><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option></select></div><div class="form-group"><label for="remarks">Remarks</label><textarea id="remarks" class="form-control" rows="4" placeholder="Enter additional remarks" ng-model="newAppointment.remarks"> </textarea></div><button type="submit" class="btn btn-default" ng-click="createAppointment()" ng-disabled="form.$invalid">Create</button></form></div><div class="col-md-8"><h2 style="text-align: center"><b>Doctor\'s Appointment Calendar</b></h2><div class="btn-toolbar"><div class="btn-group"><button class="btn btn-success" ng-click="changeView(\'agendaDay\', \'myCalendar\')">AgendaDay</button> <button class="btn btn-success" ng-click="changeView(\'agendaWeek\', \'myCalendar\')">AgendaWeek</button> <button class="btn btn-success" ng-click="changeView(\'month\', \'myCalendar\')">Month</button></div></div><div class="calendar" ng-model="eventSources" calendar="myCalendar" ui-calendar="uiConfig.calendar"></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('appoints-client-templates');
} catch (e) {
  module = angular.module('appoints-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('appointments/dashboard.html',
    '<div ng-app="appoints"><h1 style="text-align: center"><b>Welcome! {{user.displayName}}</b></h1><div class="col-md-4" ng-if="user.isAdmin"><h2><b>List of Doctors</b></h2><p ng-if="doctors.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="doctor in doctors"><h4 class="list-group-item-heading"><a href="" ng-click="openDoctorDetails(doctor)"><b>{{doctor.UserDetails.FirstName}} {{doctor.UserDetails.LastName}}</b></a></h4><h5 class="list-group-item-heading">Graduated from: {{doctor.GraduatedFrom}}</h5><h5 class="list-group-item-heading">Practice: {{doctor.FieldOfPractice}}</h5><p class="list-group-item-text">{{doctor.CurrentWorkingStatus}}</p></li></ul></div><div class="col-md-4" ng-if="user.isAdmin"><h2><b>List of Patients</b></h2><p ng-if="patients.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="patient in patients"><h4 class="list-group-item-heading"><a href="" ng-click="openPatientDetails(patient)"><b>{{patient.UserDetails.FirstName}} {{patient.UserDetails.LastName}}</b></a></h4><h5 class="list-group-item-heading">Health Issues: {{patient.HealthIssues}}</h5><h5 class="list-group-item-heading">Allergies: {{patient.Allergies}}</h5><p class="list-group-item-text">{{patient.CurrentWorkingStatus}}</p></li></ul></div><div class="col-md-4" ng-if="user.isAdmin"><h2><b>Upcoming Appointments</b></h2><p ng-if="upcomingAdminAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in upcomingAdminAppointments"><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Patient: <a href="" ng-click="openAppointmentPatient(appointment)">{{appointment.PatientName}}</a></h5><h5 class="list-group-item-heading">Doctor: <a href="" ng-click="openAppointmentDoctor(appointment)">{{appointment.DoctorName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul><h2><b>Past Appointments</b></h2><p ng-if="pastAdminAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in pastAdminAppointments"><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Patient: <a href="" ng-click="openAppointmentPatient(appointment)">{{appointment.PatientName}}</a></h5><h5 class="list-group-item-heading">Doctor: <a href="" ng-click="openAppointmentDoctor(appointment)">{{appointment.DoctorName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul></div><div class="col-md-4" ng-if="!user.isAdmin && user.isDoctor"><h2><b>Upcoming Appointments</b></h2><p ng-if="upcomingDoctorAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in upcomingDoctorAppointments"><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Patient: <a href="" ng-click="openAppointmentPatient(appointment)">{{appointment.PatientName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul><h2><b>Past Appointments</b></h2><p ng-if="pastDoctorAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in pastDoctorAppointments"><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Patient: <a href="" ng-click="openAppointmentPatient(appointment)">{{appointment.PatientName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul></div><div class="col-md-8" ng-if="!user.isAdmin && user.isDoctor"><h2 style="text-align: center"><b>Doctor\'s Appointment Calendar</b></h2><div class="btn-toolbar"><div class="btn-group"><button class="btn btn-success" ng-click="changeView(\'agendaDay\', \'myCalendar\')">AgendaDay</button> <button class="btn btn-success" ng-click="changeView(\'agendaWeek\', \'myCalendar\')">AgendaWeek</button> <button class="btn btn-success" ng-click="changeView(\'month\', \'myCalendar\')">Month</button></div></div><div class="calendar" ng-model="eventSourceDoctor" calendar="myCalendar" ui-calendar="uiConfig.calendar"></div></div><div class="col-md-4" ng-if="!user.isAdmin && !user.isDoctor"><h2><b>Upcoming appointments</b></h2><p ng-if="upcomingPatientAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in upcomingPatientAppointments"><div><a href="" class="pull-right" ng-click="deleteAppointment(appointment)" title="Delete Appointment"><span class="glyphicon glyphicon-remove"></span></a></div><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Doctor: <a href="" ng-click="openAppointmentDoctor(appointment)">{{appointment.DoctorName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul><h2><b>Past appointments</b></h2><p ng-if="pastPatientAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in pastPatientAppointments"><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Doctor: <a href="" ng-click="openAppointmentDoctor(appointment)">{{appointment.DoctorName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul></div><div class="col-md-8" ng-if="!user.isAdmin && !user.isDoctor"><h2 style="text-align: center"><b>Patient\'s Appointment Calendar</b></h2><div class="btn-toolbar"><div class="btn-group"><button class="btn btn-success" ng-click="changeView(\'agendaDay\', \'myCalendar\')">AgendaDay</button> <button class="btn btn-success" ng-click="changeView(\'agendaWeek\', \'myCalendar\')">AgendaWeek</button> <button class="btn btn-success" ng-click="changeView(\'month\', \'myCalendar\')">Month</button></div></div><div class="calendar" ng-model="eventSourcePatient" calendar="myCalendar" ui-calendar="uiConfig.calendar"></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('appoints-client-templates');
} catch (e) {
  module = angular.module('appoints-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('appointments/logindetails.html',
    '<div ng-app="appoints" class="col-md-6 col-md-offset-3"><h1 style="text-align: center;padding-bottom: 25px"><b>Update Login Details</b></h1><form name="form" ng-submit="vm.login()" role="form"><div class="form-group" ng-class="{ \'has-error\': form.oldPassword.$dirty && form.oldPassword.$error.required }"><label for="oldPassword">Old Password</label><span class="mandatoryField" style="color: red">*</span> <input type="password" name="oldPassword" id="oldPassword" class="form-control" ng-model="oldPassword" required> <span ng-show="form.oldPassword.$dirty && form.oldPassword.$error.required" class="help-block">Old password is required</span></div><div class="form-group" ng-class="{ \'has-error\': form.newPassword.$dirty && form.newPassword.$error.required }"><label for="newPassword">New Password</label><span class="mandatoryField" style="color: red">*</span> <input type="password" name="newPassword" id="newPassword" class="form-control" ng-model="newPassword" required> <span ng-show="form.newPassword.$dirty && form.newPassword.$error.required" class="help-block">New password is required</span></div><div class="form-actions"><button type="submit" ng-click="updatelogindetails()" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Submit</button> <a href="#/dashboard" class="btn btn-link">Cancel</a></div></form></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('appoints-client-templates');
} catch (e) {
  module = angular.module('appoints-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('appointments/profile.html',
    '<div class="" ng-app="appoints" ng-controller="ProfileCtrl"><div style="font-size: larger;padding-left: 5%" ng-if="isreadonly"><a class="dropdown-toggle" role="button" title="Go to Dashboard" id="patient{{$index}}" href="" ng-click="goToDashboard()"><span class="glyphicon glyphicon-circle-arrow-left"></span>Go to dashboard</a></div><h2 ng-if="!dataLoading" style="text-align: center">Details of: <b>{{profileData.UserDetails.FirstName}} {{profileData.UserDetails.LastName}}</b></h2><form name="form" ng-submit="register()" ng-if="!dataLoading" role="form"><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-12" ng-class="{ \'has-error\': form.email.$dirty && (form.email.$error.required || form.email.$error.email) }"><label for="email">Email</label><span class="mandatoryField" style="color: red">*</span> <input type="email" name="email" id="email" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.Email" required> <span ng-show="form.email.$dirty && form.email.$error.email" class="help-block">This email format is invalid!</span> <span ng-show="form.email.$dirty && form.email.$error.required" class="help-block">Email is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6" ng-class="{ \'has-error\': form.firstName.$dirty && form.firstName.$error.required }"><label for="firstName">First name</label><span class="mandatoryField" style="color: red">*</span> <input name="firstName" id="firstName" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.FirstName" required> <span ng-show="form.firstName.$dirty && form.firstName.$error.required" class="help-block">First name is required</span></div><div class="form-group col-md-6" ng-class="{ \'has-error\': form.lastName.$dirty && form.lastName.$error.required }"><label for="lastName">Last name</label><span class="mandatoryField" style="color: red">*</span> <input name="lastName" id="lastName" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.LastName" required> <span ng-show="form.lastName.$dirty && form.lastName.$error.required" class="help-block">Last name is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="maritalStatus">Marital Status</label><input name="maritalStatus" id="maritalStatus" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.MaritalStatus"></div><div class="form-group col-md-6"><label for="gender">Gender</label><input name="gender" id="gender" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.Gender"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="address">Address</label><input name="address" id="address" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.Address"></div><div class="form-group col-md-6"><label for="postalCode">Postal Code</label><input name="postalCode" id="postalCode" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.PostalCode"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="city">City</label><input name="city" id="city" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.City"></div><div class="form-group col-md-6"><label for="province">Province</label><input name="province" id="province" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.Province"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="country">Country</label><input name="country" id="country" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.Country"></div><div class="form-group col-md-6"><label for="contact">Contact</label><input type="number" name="contact" id="contact" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.Contact"></div></div><h2 style="text-align: center" ng-if="!profileData.UserDetails.IsAdmin && profileData.UserDetails.IsDoctor"><b>Doctor\'s Details</b></h2><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%" ng-if="!profileData.UserDetails.IsAdmin && profileData.UserDetails.IsDoctor"><div class="form-group col-md-6"><label for="availability">Availability</label><input name="availability" id="availability" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.Availability"></div><div class="form-group col-md-6"><label for="currentWorkingStatus">Current Working Status</label><input name="currentWorkingStatus" id="currentWorkingStatus" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.CurrentWorkingStatus"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%" ng-if="!profileData.UserDetails.IsAdmin && profileData.UserDetails.IsDoctor"><div class="form-group col-md-6"><label for="department">Department</label><input name="department" id="department" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.Department"></div><div class="form-group col-md-6"><label for="fieldOfPractice">Field of Practice</label><input name="fieldOfPractice" id="fieldOfPractice" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.FieldOfPractice"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%" ng-if="!profileData.UserDetails.IsAdmin && profileData.UserDetails.IsDoctor"><div class="form-group col-md-6"><label for="degree">Degree</label><input name="degree" id="degree" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.Degree"></div><div class="form-group col-md-6"><label for="graduatedFrom">Graduated From</label><input name="graduatedFrom" id="graduatedFrom" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.GraduatedFrom"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%" ng-if="!profileData.UserDetails.IsAdmin && profileData.UserDetails.IsDoctor"><div class="form-group col-md-6"><label for="dateOfJoining">Date of Joining</label><input name="dateOfJoining" id="dateOfJoining" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.DOJ"></div><div class="form-group col-md-6"><label for="yearsOfExp">Years of Experience</label><input name="yearsOfExp" id="yearsOfExp" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.YearsOfExp"></div></div><h2 style="text-align: center" ng-if="!profileData.UserDetails.IsAdmin && !profileData.UserDetails.IsDoctor"><b>Patient\'s Details</b></h2><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%" ng-if="(!profileData.UserDetails.IsAdmin && !profileData.UserDetails.IsDoctor)"><div class="form-group col-md-6"><label for="allergies">Allergies</label><input name="allergies" id="allergies" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.Allergies"></div><div class="form-group col-md-6"><label for="healthIssues">Health Issues</label><input name="healthIssues" id="healthIssues" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.HealthIssues"></div></div><div class="form-group col-md-12" ng-if="!isreadonly" style="padding-left: 15%;padding-right: 15%"><div class="form-actions col-md-6"><button type="submit" ng-disabled="form.$invalid || dataLoading" class="btn btn-primary">Submit</button> <a href="#/dashboard" class="btn btn-link">Cancel</a></div></div></form></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('appoints-client-templates');
} catch (e) {
  module = angular.module('appoints-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('appointments/usersignin.html',
    '<div ng-app="appoints" class="col-md-6 col-md-offset-3"><h1 style="text-align: center;padding-bottom: 25px">Login to <b>DOC Connect</b></h1><form name="form" ng-submit="vm.login()" role="form"><div class="form-group" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }"><label for="username">Username</label><span class="mandatoryField" style="color: red">*</span> <input name="username" id="username" class="form-control" ng-model="username" required> <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username is required</span></div><div class="form-group" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }"><label for="password">Password</label><span class="mandatoryField" style="color: red">*</span> <input type="password" name="password" id="password" class="form-control" ng-model="password" required> <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password is required</span></div><div class="form-actions"><button type="submit" ng-click="login()" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Login</button> <a href="#/usersignup" class="btn btn-link">Signup</a></div></form></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('appoints-client-templates');
} catch (e) {
  module = angular.module('appoints-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('appointments/usersignup.html',
    '<div class="" ng-app="appoints"><h1 style="text-align: center;padding-bottom: 25px">Sign up your practice to <b>DOC Connect</b></h1><form name="form" ng-submit="vm.register()" role="form"><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-12" ng-class="{ \'has-error\': form.email.$dirty && (form.email.$error.required || form.email.$error.email) }"><label for="username">Email</label><span class="mandatoryField" style="color: red">*</span> <input type="email" name="email" id="email" class="form-control" ng-model="signupObj.email" required> <span ng-show="form.email.$dirty && form.email.$error.email" class="help-block">This email format is invalid!</span> <span ng-show="form.email.$dirty && form.email.$error.required" class="help-block">Email is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6" ng-class="{ \'has-error\': form.firstName.$dirty && form.firstName.$error.required }"><label for="username">First name</label><span class="mandatoryField" style="color: red">*</span> <input name="firstName" id="firstName" class="form-control" ng-model="signupObj.firstName" required> <span ng-show="form.firstName.$dirty && form.firstName.$error.required" class="help-block">First name is required</span></div><div class="form-group col-md-6" ng-class="{ \'has-error\': form.lastName.$dirty && form.lastName.$error.required }"><label for="username">Last name</label><span class="mandatoryField" style="color: red">*</span> <input name="lastName" id="lastName" class="form-control" ng-model="signupObj.lastName" required> <span ng-show="form.lastName.$dirty && form.lastName.$error.required" class="help-block">Last name is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }"><label for="username">Username</label><span class="mandatoryField" style="color: red">*</span> <input name="username" id="username" class="form-control" ng-model="signupObj.username" required> <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username is required</span></div><div class="form-group col-md-6" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }"><label for="password">Password</label><span class="mandatoryField" style="color: red">*</span> <input type="password" name="password" id="password" class="form-control" ng-model="signupObj.password" required> <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password is required</span></div></div><div class="form-check col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="isPractitioner">I am a practitioner</label><input type="checkbox" name="isPractitioner" id="isPractitioner" ng-model="signupObj.isPractitioner"></div></div><div class="form-group col-md-12" ng-show="signupObj.isPractitioner" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="specialty">Your specialty</label><input name="specialty" id="specialty" class="form-control" ng-model="signupObj.specialty"> <small class="form-text text-muted"><i>"Dentistry", "Chiropractics"</i>, etc.</small></div><div class="form-group col-md-6"><label for="credentials">Credentials</label><input name="credentials" id="credentials" class="form-control" ng-model="signupObj.credentials"> <small class="form-text text-muted"><i>MD, BDS, DPM</i>, etc.</small></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-actions col-md-6"><button type="submit" ng-click="signup()" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Sign up</button> <a href="#/usersignin" class="btn btn-link">Cancel</a></div></div></form></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('appoints-client-templates');
} catch (e) {
  module = angular.module('appoints-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('home/home.html',
    '<div class="row"><div class="col-md-6" style="padding-top: 20px;font-family: cursive;font-size: 50px">A Good and healthy body is the reason behind a healthy mind.</div><div class="col-md-6"><img src="assets/images/image1.png"></div></div><div class="row"></div><footer class="pull-right">DOC Connect {{version}} - &copy; Pritpal Singh Kandhari, 2022</footer>');
}]);
})();

(function(module) {
try {
  module = angular.module('appoints-client-templates');
} catch (e) {
  module = angular.module('appoints-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('shared/flash.html',
    '<section ng-controller="FlashCtrl" class="flashcontainer"><div ng-repeat="flashMessage in flashMessages" ng-class="getMessageClass(flashMessage.level)"><button type="button" class="close" data-dismiss="alert" ng-click="dismiss(flashMessage)">&times;</button> {{flashMessage.message}}<ul ng-if="flashMessage.details.errors"><li ng-repeat="error in flashMessage.details.errors">{{error.message}}</li></ul></div></section>');
}]);
})();

/*
*  AngularJs Fullcalendar Wrapper for the JQuery FullCalendar
*  API @ http://arshaw.com/fullcalendar/
*
*  Angular Calendar Directive that takes in the [eventSources] nested array object as the ng-model and watches it deeply changes.
*       Can also take in multiple event urls as a source object(s) and feed the events per view.
*       The calendar will watch any eventSource array and update itself when a change is made.
*
*/

angular.module('ui.calendar', [])

    .constant('uiCalendarConfig', {
        calendars : {}
    })
    .controller('uiCalendarCtrl', ['$scope', '$locale', 'moment',
        function ($scope, $locale, moment) {

            var sources = $scope.eventSources;
            var extraEventSignature = $scope.calendarWatchEvent ? $scope.calendarWatchEvent : angular.noop;

            var wrapFunctionWithScopeApply = function (functionToWrap) {
                return function () {
                    // This may happen outside of angular context, so create one if outside.
                    if ($scope.$root.$$phase) {
                        return functionToWrap.apply(this, arguments);
                    }

                    var args = arguments;
                    var that = this;
                    return $scope.$root.$apply(
                        function () {
                            return functionToWrap.apply(that, args);
                        }
                    );
                };
            };

            var eventSerialId = 1;
            // @return {String} fingerprint of the event object and its properties
            this.eventFingerprint = function (e) {
                if (!e._id) {
                    e._id = eventSerialId++;
                }

                var extraSignature = extraEventSignature({
                    event : e
                }) || '';
                var start = moment.isMoment(e.start) ? e.start.unix() : (e.start ? moment(e.start).unix() : '');
                var end = moment.isMoment(e.end) ? e.end.unix() : (e.end ? moment(e.end).unix() : '');

                // This extracts all the information we need from the event. http://jsperf.com/angular-calendar-events-fingerprint/3
                return [e._id, e.id || '', e.title || '', e.url || '', start, end, e.allDay || '', e.className || '', extraSignature].join('');
            };

            var sourceSerialId = 1;
            var sourceEventsSerialId = 1;
            // @return {String} fingerprint of the source object and its events array
            this.sourceFingerprint = function (source) {
                var fp = '' + (source.__id || (source.__id = sourceSerialId++));
                var events = angular.isObject(source) && source.events;

                if (events) {
                    fp = fp + '-' + (events.__id || (events.__id = sourceEventsSerialId++));
                }
                return fp;
            };

            // @return {Array} all events from all sources
            this.allEvents = function () {
                return Array.prototype.concat.apply(
                    [],
                    (sources || []).reduce(
                        function (previous, source) {
                            if (angular.isArray(source)) {
                                previous.push(source);
                            } else if (angular.isObject(source) && angular.isArray(source.events)) {
                                var extEvent = Object.keys(source).filter(
                                    function (key) {
                                        return (key !== '_id' && key !== 'events');
                                    }
                                );

                                source.events.forEach(
                                    function (event) {
                                        angular.extend(event, extEvent);
                                    }
                                );

                                previous.push(source.events);
                            }
                            return previous;
                        },
                        []
                    )
                );
            };

            // Track changes in array of objects by assigning id tokens to each element and watching the scope for changes in the tokens
            // @param {Array|Function} arraySource array of objects to watch
            // @param tokenFn {Function} that returns the token for a given object
            // @return {Object}
            //  subscribe: function(scope, function(newTokens, oldTokens))
            //    called when source has changed. return false to prevent individual callbacks from firing
            //  onAdded/Removed/Changed:
            //    when set to a callback, called each item where a respective change is detected
            this.changeWatcher = function (arraySource, tokenFn) {
                var self;

                var getTokens = function () {
                    return ((angular.isFunction(arraySource) ? arraySource() : arraySource) || []).reduce(
                        function (rslt, el) {
                            var token = tokenFn(el);
                            map[token] = el;
                            rslt.push(token);
                            return rslt;
                        },
                        []
                    );
                };

                // @param {Array} a
                // @param {Array} b
                // @return {Array} elements in that are in a but not in b
                // @example
                //  subtractAsSets([6, 100, 4, 5], [4, 5, 7]) // [6, 100]
                var subtractAsSets = function (a, b) {
                    var obj = (b || []).reduce(
                        function (rslt, val) {
                            rslt[val] = true;
                            return rslt;
                        },
                        Object.create(null)
                    );
                    return (a || []).filter(
                        function (val) {
                            return !obj[val];
                        }
                    );
                };

                // Map objects to tokens and vice-versa
                var map = {};

                // Compare newTokens to oldTokens and call onAdded, onRemoved, and onChanged handlers for each affected event respectively.
                var applyChanges = function (newTokens, oldTokens) {
                    var i;
                    var token;
                    var replacedTokens = {};
                    var removedTokens = subtractAsSets(oldTokens, newTokens);
                    for (i = 0; i < removedTokens.length; i++) {
                        var removedToken = removedTokens[i];
                        var el = map[removedToken];
                        delete map[removedToken];
                        var newToken = tokenFn(el);
                        // if the element wasn't removed but simply got a new token, its old token will be different from the current one
                        if (newToken === removedToken) {
                            self.onRemoved(el);
                        } else {
                            replacedTokens[newToken] = removedToken;
                            self.onChanged(el);
                        }
                    }

                    var addedTokens = subtractAsSets(newTokens, oldTokens);
                    for (i = 0; i < addedTokens.length; i++) {
                        token = addedTokens[i];
                        if (!replacedTokens[token]) {
                            self.onAdded(map[token]);
                        }
                    }
                };

                self = {
                    subscribe : function (scope, onArrayChanged) {
                        scope.$watch(getTokens, function (newTokens, oldTokens) {
                            var notify = !(onArrayChanged && onArrayChanged(newTokens, oldTokens) === false);
                            if (notify) {
                                applyChanges(newTokens, oldTokens);
                            }
                        }, true);
                    },
                    onAdded : angular.noop,
                    onChanged : angular.noop,
                    onRemoved : angular.noop
                };
                return self;
            };

            this.getFullCalendarConfig = function (calendarSettings, uiCalendarConfig) {
                var config = {};

                angular.extend(config, uiCalendarConfig);
                angular.extend(config, calendarSettings);

                angular.forEach(config, function (value, key) {
                    if (typeof value === 'function') {
                        config[key] = wrapFunctionWithScopeApply(config[key]);
                    }
                });

                return config;
            };

            this.getLocaleConfig = function (fullCalendarConfig) {
                if (!fullCalendarConfig.lang && !fullCalendarConfig.locale || fullCalendarConfig.useNgLocale) {
                    // Configure to use locale names by default
                    var tValues = function (data) {
                        // convert {0: "Jan", 1: "Feb", ...} to ["Jan", "Feb", ...]
                        return (Object.keys(data) || []).reduce(
                            function (rslt, el) {
                                rslt.push(data[el]);
                                return rslt;
                            },
                            []
                        );
                    };

                    var dtf = $locale.DATETIME_FORMATS;
                    return {
                        monthNames : tValues(dtf.MONTH),
                        monthNamesShort : tValues(dtf.SHORTMONTH),
                        dayNames : tValues(dtf.DAY),
                        dayNamesShort : tValues(dtf.SHORTDAY)
                    };
                }

                return {};
            };
        }
    ])
    .directive('uiCalendar', ['uiCalendarConfig',
        function (uiCalendarConfig) {

            return {
                restrict : 'A',
                scope : {
                    eventSources : '=ngModel',
                    calendarWatchEvent : '&'
                },
                controller : 'uiCalendarCtrl',
                link : function (scope, elm, attrs, controller) {
                    var sources = scope.eventSources;
                    var sourcesChanged = false;
                    var calendar;
                    var eventSourcesWatcher = controller.changeWatcher(sources, controller.sourceFingerprint);
                    var eventsWatcher = controller.changeWatcher(controller.allEvents, controller.eventFingerprint);
                    var options = null;

                    function getOptions () {
                        var calendarSettings = attrs.uiCalendar ? scope.$parent.$eval(attrs.uiCalendar) : {};
                        var fullCalendarConfig = controller.getFullCalendarConfig(calendarSettings, uiCalendarConfig);
                        var localeFullCalendarConfig = controller.getLocaleConfig(fullCalendarConfig);
                        angular.extend(localeFullCalendarConfig, fullCalendarConfig);
                        options = {
                            eventSources : sources
                        };
                        angular.extend(options, localeFullCalendarConfig);
                        //remove calendars from options
                        options.calendars = null;

                        var options2 = {};
                        for (var o in options) {
                            if (o !== 'eventSources') {
                                options2[o] = options[o];
                            }
                        }
                        return JSON.stringify(options2);
                    }

                    scope.destroyCalendar = function () {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar('destroy');
                        }
                        if (attrs.calendar) {
                            calendar = uiCalendarConfig.calendars[attrs.calendar] = angular.element(elm).html('');
                        } else {
                            calendar = angular.element(elm).html('');
                        }
                    };

                    scope.initCalendar = function () {
                        if (!calendar) {
                            calendar = $(elm).html('');
                        }
                        calendar.fullCalendar(options);
                        if (attrs.calendar) {
                            uiCalendarConfig.calendars[attrs.calendar] = calendar;
                        }
                    };

                    scope.$on('$destroy', function () {
                        scope.destroyCalendar();
                    });

                    eventSourcesWatcher.onAdded = function (source) {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar(options);
                            if (attrs.calendar) {
                                uiCalendarConfig.calendars[attrs.calendar] = calendar;
                            }
                            calendar.fullCalendar('addEventSource', source);
                            sourcesChanged = true;
                        }
                    };

                    eventSourcesWatcher.onRemoved = function (source) {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar('removeEventSource', source);
                            sourcesChanged = true;
                        }
                    };

                    eventSourcesWatcher.onChanged = function () {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar('refetchEvents');
                            sourcesChanged = true;
                        }
                    };

                    eventsWatcher.onAdded = function (event) {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar('renderEvent', event, !!event.stick);
                        }
                    };

                    eventsWatcher.onRemoved = function (event) {
                        if (calendar && calendar.fullCalendar) {
                            calendar.fullCalendar('removeEvents', event._id);
                        }
                    };

                    eventsWatcher.onChanged = function (event) {
                        if (calendar && calendar.fullCalendar) {
                            var clientEvents = calendar.fullCalendar('clientEvents', event._id);
                            for (var i = 0; i < clientEvents.length; i++) {
                                var clientEvent = clientEvents[i];
                                clientEvent = angular.extend(clientEvent, event);
                                calendar.fullCalendar('updateEvent', clientEvent);
                            }
                        }
                    };

                    eventSourcesWatcher.subscribe(scope);
                    eventsWatcher.subscribe(scope, function () {
                        if (sourcesChanged === true) {
                            sourcesChanged = false;
                            // return false to prevent onAdded/Removed/Changed handlers from firing in this case
                            return false;
                        }
                    });

                    scope.$watch(getOptions, function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            scope.destroyCalendar();
                            scope.initCalendar();
                        } else if ((newValue && angular.isUndefined(calendar))) {
                            scope.initCalendar();
                        }
                    });
                }
            };
        }
    ]
);

angular.module("appoints.config", [])

.constant("config", {
	"defaultApiEndpoint": "http://localhost:3000",
	"apiEndpoint": "http://localhost/DocConnectAPI"
})

.constant("appName", "appoints-client")

.constant("appVersion", "0.1.0")

.constant("appDescription", "Doctor appointment scheduler app")

;
angular.module('appoints.directives', []);
angular.module('appoints.flash', []) 
.factory('flash', function ($rootScope, $timeout) {
  var flashes = [];

  function add (message, level, details) {
    level = level || 'info';

    var flash = {
      message: message,
      level: level,
      details: details
    };
    flashes.push(flash);
    $timeout(function () {
      remove(flash);
    }, 5000);
    $rootScope.$broadcast('event:flash.add', flash);
  }

  function addError (err) {
    if (err.message) {
      add(err.message, 'error', err);
    }
    else {
      add(err, 'error');
    }
  }

  function all () {
    return flashes;
  }

  function remove (flashMessage) {
    var index = flashes.indexOf(flashMessage);
    flashes.splice(index, 1);
    $rootScope.$broadcast('event:flash.remove', flashMessage);
  }

  function clear () {
    flashes = [];
    $rootScope.$broadcast('event:flash.clear', true);
  }

  return {
    add: add,
    addError: addError,
    all: all,
    remove: remove,
    clear: clear
  };
})

.controller('FlashCtrl', function ($scope, flash) {
  $scope.flashMessages = [];

  $scope.getMessageClass = function(level) {
    if (level === 'error') {
      level = 'danger';
    }
    return 'alert alert-' + level;
  };

  $scope.dismiss = function (flashMessage) {
    flash.remove(flashMessage);
  };

  $scope.$on('event:flash.add', function() {
    $scope.flashMessages = flash.all();
  });

  $scope.$on('event:flash.remove', function() {
    $scope.flashMessages = flash.all();
  });

  $scope.$on('event:flash.clear', function() {
    $scope.flashMessages = [];
    $scope.$apply();
  });
})

.directive('apHideFlash', function(flash) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.bind('click', function(e){
        // Clear flash messages when the user clicks anywhere in the element where this directive is applied to.
        var target = angular.element(e.target);
        if (! target.parents().hasClass('flashcontainer')) {
          flash.clear();
        }
      });
    }
  };
});
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
angular.module('appoints.usersession', [
  'appoints.flash',
  'appoints.config'
])

  .factory('usersession', function ($rootScope, $window, config, flash, $http) {

    var defaultSession = {
      userId: '',
      displayName: '',
      isAuthenticated: false,
      isAdmin: false,
      isDoctor: false
    };

    function Session() {
      return angular.copy(defaultSession, this);
    }

    var currentSession = new Session();

    function login(loginObj) {
      var req = {
        method: "POST",
        url: config.apiEndpoint + "/login",
        data: loginObj
      };
      return $http(req)
        .then(function (result) {
          var userResource = result.data;
          if (userResource.UserId > 0) {
            currentSession.isAuthenticated = true;
            currentSession.userId = userResource.UserId;
            currentSession.displayName = userResource.DisplayName;
            currentSession.isAdmin = userResource.IsAdmin;
            currentSession.isDoctor = userResource.IsDoctor;
            $window.localStorage.setItem('access_token', JSON.stringify(userResource));
            $rootScope.$broadcast('event:loggedin', currentSession);
          }
        }, function (err) {
          flash.add(err.data.ExceptionMessage, 'error');
        });
    }

    function signup(signupObj) {
      var req = {
        method: "POST",
        url: config.apiEndpoint + "/signup",
        data: signupObj
      };
      return $http(req)
        .then(function (result) {
          return result;
        }, function (err) {
          flash.add(err.data.ExceptionMessage, 'error');
        });
    }

    function updatelogindetails(loginObj) {
      var req = {
        method: "PUT",
        url: config.apiEndpoint + "/login",
        data: loginObj
      };
      return $http(req)
        .then(function (result) {
          return result;
        }, function (err) {
          flash.add(err.data.ExceptionMessage, 'error');
        });
    }

    function logout() {
      $window.localStorage.removeItem('access_token');
      currentSession = new Session();
      $rootScope.$broadcast('event:loggedout', currentSession);
    }

    var returnTo = '';

    return {
      current: currentSession,
      login: login,
      signup: signup,
      updatelogindetails: updatelogindetails,
      logout: logout,
      returnTo: returnTo
    };
  })

  .run(function ($window, $rootScope, usersession) {
    // Automatically try to login the user when starting up this module
    if ($window.localStorage.getItem('access_token') !== null) {

      var userResource = JSON.parse($window.localStorage.getItem('access_token'));
      if (userResource.UserId > 0) {
        usersession.current.isAuthenticated = true;
        usersession.current.userId = userResource.UserId;
        usersession.current.displayName = userResource.DisplayName;
        usersession.current.isAdmin = userResource.IsAdmin;
        usersession.current.isDoctor = userResource.IsDoctor;
        $rootScope.$broadcast('event:loggedin', usersession.current);
      }
    }
  });
angular.module('appoints.home', [
  'appoints.config',
  'ngRoute'
])



.controller('HomeCtrl', function HomeController($scope, appVersion) {
  $scope.version = appVersion;
});
angular.module('appoints.api', [
  'angular-hal',
  'appoints.config'
]) 

.factory('appointsapi', function (halClient, config) {

  var apiRoot = halClient.$get(config.defaultApiEndpoint);

  return {
    apiRoot: apiRoot
  };
  
});
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
                .then(function (appointments) {
                    // $scope.upcomingAppointments = _.filter(appointments.data, function (appointment) {
                    //     appointment.title = appointment.Title;
                    //     appointment.start = moment(appointment.DateAndTime);
                    //     appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
                    //     appointment.allDay = false;
                    //     return moment(appointment.DateAndTime) > moment();
                    // });
                    // $scope.pastAppointments = _.filter(appointments.data, function (appointment) {
                    //     appointment.title = appointment.Title;
                    //     appointment.start = moment(appointment.DateAndTime);
                    //     appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
                    //     appointment.allDay = false;
                    //     $scope.addEventPat(appointment);
                    //     return moment(appointment.DateAndTime) <= moment();
                    // });
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
            // $scope.alertMessage = (date.title + ' was clicked ');
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
angular.module('appoints.profile', [
    'appoints.config',
    'appoints.usersession'
])

    .controller('ProfileCtrl', function ProfileController($scope, $rootScope, $timeout, config, usersession, $http, $location, flash, $routeParams) {
        // var profileVM = this;
        $scope.isreadonly = $routeParams.isreadonly === 'true';
        $scope.dataLoading = true;

        $scope.getProfileData = function () {
            var reqURL = config.apiEndpoint;

            if ($scope.isreadonly) {
                if ($routeParams.isdoctor === 'true') {
                    reqURL = reqURL + "/doctors/" + $routeParams.userid;
                }
                else {
                    reqURL = reqURL + "/patients/" + $routeParams.userid;
                }
            }
            else {
                if (usersession.current.isAdmin) {
                    reqURL = reqURL + "/admins/" + usersession.current.userId;
                }
                else if (usersession.current.isDoctor) {
                    reqURL = reqURL + "/doctors/" + usersession.current.userId;
                }
                else {
                    reqURL = reqURL + "/patients/" + usersession.current.userId;
                }
            }

            var req = {
                method: "GET",
                url: reqURL
            };
            return $http(req)
                .then(function (result) {
                    $scope.dataLoading = false;
                    $scope.profileData = result.data;
                }, function (err) {
                    flash.add(err.data.ExceptionMessage, 'error');
                });
        };

        $scope.goToDashboard = function () {
            $location.url('/dashboard');
        };

        $scope.getProfileData();
        // $timeout(function () {
        //     $scope.getProfileData(); // this is the called function
        //   }, 3000);
    });


angular.module('appoints.signin', [
  'appoints.api',
  'appoints.config',
  'appoints.usersession',
  'appoints.flash',
  'ngRoute'
])

  .controller('UserSigninCtrl', function UserSigninController($scope, flash, $http, $window, $rootScope, $location, config, usersession) {

    $scope.login = function () {
      var loginObj = {};
      loginObj.username = $scope.username;
      loginObj.password = $scope.password;
      usersession.login(loginObj)
        .then(function () {
          if (usersession.current.isAuthenticated) {
            if (usersession.returnTo) {
              $location.url(usersession.returnTo);
            }
            else {
              $location.url('/dashboard');
            }
          }
          else {
            flash.add('Invalid username or password.', 'error');
          }
        });
    };
  });
angular.module('appoints.signup', [
    'ngRoute',
    'appoints.api'
])

    .controller('UserSignupCtrl', function UserSignupController($scope, usersession, $location) {
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
            if ($scope.signupObj.isPractitioner) {
                $scope.signupObj.firstName = 'Dr. ' + $scope.signupObj.firstName;
            }
            usersession.signup($scope.signupObj)
                .then(function (result) {
                    var userResource = result.data;
                    if (userResource.UserId > 0) {
                        $location.url('/usersignin');
                    }
                });
        };
    });
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
      .when('/appointment/:isreadonly/:appointmentid', {
        templateUrl: 'appointments/appointment.html',
        controller: 'AppointmentCtrl',
        title: 'Appointment'
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
      .when('/logindetails', {
        templateUrl: 'appointments/logindetails.html',
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