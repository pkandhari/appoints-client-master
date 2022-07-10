(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('auth/login.html', '<h2>Login</h2><p>Appoints doesn\'t store user credentials such as usernames and passwords. It\'s required to use one of the providers below.</p><p><a href="" ng-click="loginGoogle()">Login with Google</a></p>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('appointments/appointments.html', '<div ng-app="appoints" class="row"><div class="col-md-6"><h2>Create new appointment</h2><form role="form" name="form"><div class="form-group"><input class="form-control" id="title" placeholder="Enter appointment description" ng-model="newAppointment.title"></div><div class="form-group"><label for="dateAndTime">Appointment date and time</label><div class="dropdown"><a class="dropdown-toggle" id="dropdown2" role="button" data-toggle="dropdown" data-target="." href="#"><div class="input-group"><p class="form-control-static">{{ newAppointment.dateAndTime | date:\'d MMM, y H:mm\' }}</p></div></a><ul class="" role="menu" aria-labelledby="dLabel"><datetimepicker ng-model="newAppointment.dateAndTime" data-on-set-time="onTimeSet(newDate, oldDate)" datetimepicker-config="{ dropdownSelector: \'#dropdown2\', startView: \'hour\', minuteStep: 15 }"></ul></div></div><div class="form-group"><label for="duration">Duration</label><select class="form-control" id="duration" ng-model="newAppointment.duration"><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option></select></div><div class="form-group"><label for="remarks">Remarks</label><textarea id="remarks" class="form-control" rows="3" ng-model="newAppointment.remarks"> </textarea></div><button type="submit" class="btn btn-default" ng-click="createAppointment()" ng-disabled="form.$invalid">Create</button></form></div><div class="col-md-6"><h2>Upcoming appointments</h2><p ng-if="upcomingAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in upcomingAppointments"><div><div class="dropdown"><a href="" class="pull-right" ng-click="removeAppointment(appointment)" title="Remove"><span class="glyphicon glyphicon-remove"></span></a> <a class="dropdown-toggle" role="button" data-toggle="dropdown" data-target="#" title="Reschedule appointment" id="appointment{{$index}}" href="" ng-click="setAppointmentForEdit(appointment)"><span class="glyphicon glyphicon-time"></span></a><ul class="dropdown-menu" role="menu"><datetimepicker data-ng-model="editAppointment.dateAndTime" data-datetimepicker-config="{ dropdownSelector: \'#appointment{{$index}}\', startView: \'hour\', minuteStep: 15 }" on-set-time="reschedule(newDate, oldDate)"></ul></div></div><h4 class="list-group-item-heading">{{appointment.title}} <small>{{appointment.dateAndTime | date:\'d MMM, y H:mm\'}}-{{appointment.endDateAndTime | date:\'H:mm\'}}, duration {{appointment.duration}} mins</small></h4><p class="list-group-item-text">{{appointment.remarks}}</p></li></ul><h2>Past appointments</h2><p ng-if="pastAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in pastAppointments"><div><a href="" class="pull-right" ng-click="removeAppointment(appointment)" title="Remove"><span class="glyphicon glyphicon-remove"></span></a></div><h4 class="list-group-item-heading">{{appointment.title}} <small>{{appointment.dateAndTime | date:\'d MMM, y H:mm\'}}-{{appointment.endDateAndTime | date:\'H:mm\'}}, duration {{appointment.duration}} mins</small></h4><p class="list-group-item-text">{{appointment.remarks}}</p></li></ul></div></div>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('appointments/profile.html', '<div class="" ng-app="appoints" ng-controller="ProfileCtrl"><h1 ng-if="!dataLoading" style="text-align: center;padding-bottom: 25px"><b>{{profileData.UserDetails.FirstName}} {{profileData.UserDetails.LastName}}</b></h1><form name="form" ng-submit="register()" ng-if="!dataLoading" role="form"><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-12" ng-class="{ \'has-error\': form.email.$dirty && (form.email.$error.required || form.email.$error.email) }"><label for="username">Email</label><input type="email" name="email" id="email" class="form-control" ng-model="profileData.UserDetails.Email" required> <span ng-show="form.email.$dirty && form.email.$error.email" class="help-block">This email format is invalid!</span> <span ng-show="form.email.$dirty && form.email.$error.required" class="help-block">Email is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6" ng-class="{ \'has-error\': form.firstName.$dirty && form.firstName.$error.required }"><label for="username">First name</label><input name="firstName" id="firstName" class="form-control" ng-model="profileData.UserDetails.FirstName" required> <span ng-show="form.firstName.$dirty && form.firstName.$error.required" class="help-block">First name is required</span></div><div class="form-group col-md-6" ng-class="{ \'has-error\': form.lastName.$dirty && form.lastName.$error.required }"><label for="username">Last name</label><input name="lastName" id="lastName" class="form-control" ng-model="profileData.UserDetails.LastName" required> <span ng-show="form.lastName.$dirty && form.lastName.$error.required" class="help-block">Last name is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="username">Marital Status</label><input name="maritalStatus" id="maritalStatus" class="form-control" ng-model="profileData.UserDetails.MaritalStatus"></div><div class="form-group col-md-6"><label for="username">Gender</label><input name="gender" id="gender" class="form-control" ng-model="profileData.UserDetails.Gender"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="username">Address</label><input name="address" id="address" class="form-control" ng-model="profileData.UserDetails.Address"></div><div class="form-group col-md-6"><label for="username">Postal Code</label><input name="postalCode" id="postalCode" class="form-control" ng-model="profileData.UserDetails.PostalCode"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="username">City</label><input name="city" id="city" class="form-control" ng-model="profileData.UserDetails.City"></div><div class="form-group col-md-6"><label for="username">Province</label><input name="province" id="province" class="form-control" ng-model="profileData.UserDetails.Province"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="username">Country</label><input name="country" id="country" class="form-control" ng-model="profileData.UserDetails.Country"></div><div class="form-group col-md-6"><label for="username">Contact</label><input type="number" name="contact" id="contact" class="form-control" ng-model="profileData.UserDetails.Contact"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-actions col-md-6"><button type="submit" ng-disabled="form.$invalid || dataLoading" class="btn btn-primary">Submit</button> <a href="#/usersignin" class="btn btn-link">Cancel</a></div></div></form></div>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('appointments/usersignin.html', '<div ng-app="appoints" class="col-md-6 col-md-offset-3"><h2>Login</h2><form name="form" ng-submit="vm.login()" role="form"><div class="form-group" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }"><label for="username">Username</label><input name="username" id="username" class="form-control" ng-model="username" required> <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username is required</span></div><div class="form-group" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }"><label for="password">Password</label><input type="password" name="password" id="password" class="form-control" ng-model="password" required> <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password is required</span></div><div class="form-actions"><button type="submit" ng-click="login()" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Login</button> <img ng-if="vm.dataLoading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="> <a href="#/usersignup" class="btn btn-link">Signup</a></div></form></div>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('appointments/usersignup.html', '<div class="" ng-app="appoints"><h1 style="text-align: center;padding-bottom: 25px">Sign up your practice to <b>DOC Connect</b></h1><form name="form" ng-submit="vm.register()" role="form"><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-12" ng-class="{ \'has-error\': form.email.$dirty && (form.email.$error.required || form.email.$error.email) }"><label for="username">Email</label><input type="email" name="email" id="email" class="form-control" ng-model="vm.user.email" required> <span ng-show="form.email.$dirty && form.email.$error.email" class="help-block">This email format is invalid!</span> <span ng-show="form.email.$dirty && form.email.$error.required" class="help-block">Email is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6" ng-class="{ \'has-error\': form.firstName.$dirty && form.firstName.$error.required }"><label for="username">First name</label><input name="firstName" id="firstName" class="form-control" ng-model="vm.user.firstName" required> <span ng-show="form.firstName.$dirty && form.firstName.$error.required" class="help-block">First name is required</span></div><div class="form-group col-md-6" ng-class="{ \'has-error\': form.lastName.$dirty && form.lastName.$error.required }"><label for="username">Last name</label><input name="lastName" id="lastName" class="form-control" ng-model="vm.user.lastName" required> <span ng-show="form.lastName.$dirty && form.lastName.$error.required" class="help-block">Last name is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }"><label for="username">Username</label><input name="username" id="username" class="form-control" ng-model="vm.user.username" required> <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username is required</span></div><div class="form-group col-md-6" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }"><label for="password">Password</label><input type="password" name="password" id="password" class="form-control" ng-model="vm.user.password" required> <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-actions col-md-6"><button type="submit" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Sign up</button> <img ng-if="vm.dataLoading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="> <a href="#/usersignin" class="btn btn-link">Cancel</a></div></div></form></div>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('home/home.html', '<div class="row"><div class="col-md-6" style="padding-top: 20px;font-family: cursive;font-size: 50px">A Good and healthy body is the reason behind a healthy mind.</div><div class="col-md-6"><img src="assets/images/image1.png"></div></div><div class="row"><div class="col-md-8"><h3>Where to go next?</h3><ul><li><a href="#/appointments">Schedule some appointments</a></li><li><a href="#/usersignup">User Signup</a></li><li><a href="#/usersignin">User Signin</a></li><li><a href="#/profile">Profile</a></li><li><a href="#/login">User Login</a></li><li><a href="https://github.com/martijnboland/appoints-api-node">Go to the appoints-api GitHub project (and perhaps write a client for it?)</a></li><li><a href="https://github.com/martijnboland/appoints-client">Go to the appoints-client GitHub project (this application)</a></li></ul></div></div><footer class="pull-right">DOC Connect {{version}} - &copy; Pritpal Singh Kandhari, 2022</footer>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('shared/flash.html', '<section ng-controller="FlashCtrl" class="flashcontainer"><div ng-repeat="flashMessage in flashMessages" ng-class="getMessageClass(flashMessage.level)"><button type="button" class="close" data-dismiss="alert" ng-click="dismiss(flashMessage)">&times;</button> {{flashMessage.message}}<ul ng-if="flashMessage.details.errors"><li ng-repeat="error in flashMessage.details.errors">{{error.message}}</li></ul></div></section>');
    }
  ]);
}());
angular.module('appoints.config', []).constant('config', {
  'defaultApiEndpoint': 'http://localhost:3000',
  'apiEndpoint': 'http://localhost/DocConnectAPI'
}).constant('appName', 'appoints-client').constant('appVersion', '0.1.0').constant('appDescription', 'An example appointment scheduler app');
;
angular.module('appoints.directives', []);
angular.module('appoints.flash', []).factory('flash', [
  '$rootScope',
  '$timeout',
  function ($rootScope, $timeout) {
    var flashes = [];
    function add(message, level, details) {
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
    function addError(err) {
      if (err.message) {
        add(err.message, 'error', err);
      } else {
        add(err, 'error');
      }
    }
    function all() {
      return flashes;
    }
    function remove(flashMessage) {
      var index = flashes.indexOf(flashMessage);
      flashes.splice(index, 1);
      $rootScope.$broadcast('event:flash.remove', flashMessage);
    }
    function clear() {
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
  }
]).controller('FlashCtrl', [
  '$scope',
  'flash',
  function ($scope, flash) {
    $scope.flashMessages = [];
    $scope.getMessageClass = function (level) {
      if (level === 'error') {
        level = 'danger';
      }
      return 'alert alert-' + level;
    };
    $scope.dismiss = function (flashMessage) {
      flash.remove(flashMessage);
    };
    $scope.$on('event:flash.add', function () {
      $scope.flashMessages = flash.all();
    });
    $scope.$on('event:flash.remove', function () {
      $scope.flashMessages = flash.all();
    });
    $scope.$on('event:flash.clear', function () {
      $scope.flashMessages = [];
      $scope.$apply();
    });
  }
]).directive('apHideFlash', [
  'flash',
  function (flash) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.bind('click', function (e) {
          // Clear flash messages when the user clicks anywhere in the element where this directive is applied to.
          var target = angular.element(e.target);
          if (!target.parents().hasClass('flashcontainer')) {
            flash.clear();
          }
        });
      }
    };
  }
]);
angular.module('appoints.home', [
  'appoints.config',
  'ngRoute'
]).controller('HomeCtrl', [
  '$scope',
  'appVersion',
  function HomeController($scope, appVersion) {
    $scope.version = appVersion;
  }
]);
angular.module('appoints.api', [
  'angular-hal',
  'appoints.config'
]).factory('appointsapi', [
  'halClient',
  'config',
  function (halClient, config) {
    var apiRoot = halClient.$get(config.defaultApiEndpoint);
    return { apiRoot: apiRoot };
  }
]);
angular.module('appoints.appointments', [
  'ngRoute',
  'appoints.api'
]).controller('AppointmentsCtrl', [
  '$scope',
  '$window',
  '_',
  'appointsapi',
  'flash',
  'moment',
  function AppointmentsController($scope, $window, _, appointsapi, flash, moment) {
    function load() {
      return appointsapi.apiRoot.then(function (rootResource) {
        return rootResource.$get('appointments').then(function (appointmentsResource) {
          return appointmentsResource.$get('appointment').then(function (appointments) {
            // get embedded appointments
            $scope.upcomingAppointments = _.filter(appointments, function (appointment) {
              return moment(appointment.dateAndTime) > moment();
            });
            $scope.pastAppointments = _.filter(appointments, function (appointment) {
              return moment(appointment.dateAndTime) <= moment();
            });
          });
        }, function (err) {
          flash.addError(err.data);
        });
      });
    }
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
      $scope.newAppointment.endDateAndTime = moment($scope.newAppointment.dateAndTime).add($scope.newAppointment.duration, 'minutes');  // return rootResource.$post('appointments', null, $scope.newAppointment).then(function () {
                                                                                                                                        //   flash.add('Appointment created successfully', 'info');
                                                                                                                                        //   initAppointment();
                                                                                                                                        // }, function (err) {
                                                                                                                                        //   flash.addError(err.data);
                                                                                                                                        // });
    };
    $scope.removeAppointment = function (appointmentResource) {
      if ($window.confirm('Are you sure?')) {
        return appointmentResource.$del('self').then(function (result) {
          flash.add(result.message);
        }, function (err) {
          flash.addError(err.data);
        }).then(load);
      }
    };
    $scope.setAppointmentForEdit = function (appointment) {
      $scope.editAppointment = angular.copy(appointment);
    };
    $scope.reschedule = function (newDateTime) {
      if ($scope.editAppointment) {
        $scope.editAppointment.dateAndTime = newDateTime;
        $scope.editAppointment.endDateAndTime = moment($scope.editAppointment.dateAndTime).add($scope.editAppointment.duration, 'minutes').toDate();
        var appointmentResource = _($scope.upcomingAppointments).find({ id: $scope.editAppointment.id });
        return appointmentResource.$patch('self', null, {
          dateAndTime: $scope.editAppointment.dateAndTime,
          endDateAndTime: $scope.editAppointment.endDateAndTime
        }).then(function () {
          flash.add('Appointment is rescheduled');
        }, function (err) {
          flash.addError(err.data);
        }).then(load);
      }
    };
    initAppointment();
    load();
  }
]);
angular.module('appoints.signup', [
  'ngRoute',
  'appoints.api'
]).controller('UserSignupCtrl', [
  '$scope',
  '$window',
  '_',
  'appointsapi',
  'flash',
  'moment',
  function UserSignupController($scope, $window, _, appointsapi, flash, moment) {
  }
]);
angular.module('appoints.usersession', [
  'appoints.api',
  'appoints.flash',
  'appoints.config'
]).factory('usersession', [
  '$rootScope',
  '$window',
  'config',
  'flash',
  '$http',
  function ($rootScope, $window, config, flash, $http) {
    var defaultSession = {
        userId: '',
        displayName: '',
        isAuthenticated: false,
        isAdmin: false,
        isDoctor: false
      };
    function Session() {
      // always start with a default instance.
      return angular.copy(defaultSession, this);
    }
    var currentSession = new Session();
    function login(loginObj) {
      // Authenticate the user from the given authorization token
      $window.localStorage.setItem('access_token', loginObj);
      // return appointsapi.apiRoot.then(function (rootResource) {
      //   return rootResource.$get('me').then(function (userResource) {
      //     currentSession.isAuthenticated = true;
      //     currentSession.userId = userResource.userId;
      //     currentSession.displayName = userResource.displayName;
      //     $rootScope.$broadcast('event:loggedin', currentSession);
      //   }, function (err) {
      //     flash.add(err.message, 'error');
      //   });
      // });
      var req = {
          method: 'POST',
          url: config.apiEndpoint + '/api/login',
          data: loginObj
        };
      return $http(req).then(function (result) {
        var userResource = result.data;
        if (userResource.UserId > 0) {
          currentSession.isAuthenticated = true;
          currentSession.userId = userResource.UserId;
          currentSession.displayName = userResource.DisplayName;
          currentSession.isAdmin = userResource.IsAdmin;
          currentSession.isDoctor = userResource.IsDoctor;
          $rootScope.$broadcast('event:loggedin', currentSession);
        }
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
      logout: logout,
      returnTo: returnTo
    };
  }
]).run([
  '$window',
  '$rootScope',
  '$log',
  'appointsapi',
  'usersession',
  function ($window, $rootScope, $log, appointsapi, usersession) {
  }
]);
angular.module('appoints.profile', [
  'appoints.config',
  'appoints.usersession'
]).controller('ProfileCtrl', [
  '$scope',
  'config',
  'usersession',
  '$http',
  'flash',
  function ProfileController($scope, config, usersession, $http, flash) {
    // var profileVM = this;
    $scope.dataLoading = true;
    $scope.getProfileData = function () {
      var reqURL = config.apiEndpoint;
      if (usersession.current.isAdmin)
        reqURL = reqURL + '/admins/' + usersession.current.userId;
      else if (usersession.current.isDoctor)
        reqURL = reqURL + '/doctors/' + usersession.current.userId;
      else
        reqURL = reqURL + '/patients/' + usersession.current.userId;
      var req = {
          method: 'GET',
          url: reqURL
        };
      return $http(req).then(function (result) {
        $scope.dataLoading = false;
        $scope.profileData = result.data;
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.getProfileData();
  }
]);
angular.module('appoints.signin', [
  'appoints.api',
  'appoints.config',
  'appoints.usersession',
  'appoints.flash',
  'ngRoute'
]).controller('UserSigninCtrl', [
  '$scope',
  'flash',
  '$http',
  '$window',
  '$rootScope',
  '$location',
  'config',
  'usersession',
  function UserSigninController($scope, flash, $http, $window, $rootScope, $location, config, usersession) {
    $scope.login = function () {
      var loginObj = {};
      loginObj.username = $scope.username;
      loginObj.userPassword = $scope.password;
      usersession.login(loginObj).then(function () {
        if (usersession.current.isAuthenticated) {
          if (usersession.returnTo) {
            $location.url(usersession.returnTo);
          } else {
            $location.url('/');
          }
        } else {
          flash.add('Invalid username or password.', 'error');
        }
      });  // var req = {
           //   method: "GET",
           //   url: "http://localhost/DocConnectAPI/api/values"
           // };
           // $http(req)
           //   .then(function mySuccess(response) {
           //     $scope.myWelcome = response.data;
           //   });
    };
  }
]);
angular.module('appoints.authinterceptor', ['appoints.usersession']).factory('authInterceptor', [
  '$rootScope',
  '$q',
  '$window',
  '$location',
  '$log',
  '$injector',
  function ($rootScope, $q, $window, $location, $log, $injector) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.localStorage.getItem('access_token')) {
          config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('access_token');
        }
        return config;
      },
      response: function (response) {
        if (response.status === 401) {
          $log.warn('Response 401');
        }
        return response || $q.when(response);
      },
      responseError: function (rejection) {
        if (rejection.status === 401) {
          var usersession = $injector.get('usersession');
          // usersession via injector because of circular dependencies with $http
          $log.info('Response Error 401', rejection);
          usersession.logout();
          var returnTo = $location.path();
          $location.path('/login').search('returnTo', returnTo);
        }
        return $q.reject(rejection);
      }
    };
  }
]).config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }
]);
angular.module('appoints.login', [
  'appoints.config',
  'appoints.usersession',
  'ngRoute'
]).run([
  '$window',
  '$rootScope',
  '$location',
  'config',
  'usersession',
  function ($window, $rootScope, $location, config, usersession) {
    $window.addEventListener('message', function (event) {
      if (event.origin !== config.defaultApiEndpoint) {
        return;
      }
      usersession.login(event.data).then(function (currentSession) {
        if ($rootScope.loginPopup) {
          $rootScope.loginPopup.close();
          delete $rootScope.loginPopup;
        }
        if (usersession.returnTo) {
          $location.url(usersession.returnTo);
        } else {
          $location.url('/');
        }
      });
    }, false);
  }
]).controller('LoginCtrl', [
  '$scope',
  '$rootScope',
  '$window',
  '$location',
  'config',
  'usersession',
  function LoginController($scope, $rootScope, $window, $location, config, usersession) {
    usersession.returnTo = $location.search().returnTo;  // $scope.loginGoogle = function () {
                                                         //   return authWindow(config.defaultApiEndpoint + '/auth/google');
                                                         // };
                                                         // function authWindow(authUrl) {
                                                         //   $rootScope.loginPopup = popupCenterWindow(authUrl, 'authenticate', 640, 500);
                                                         //   return false;
                                                         // }
                                                         // function popupCenterWindow(url, title, w, h) {
                                                         //   var left = (screen.width / 2) - (w / 2);
                                                         //   var top = (screen.height / 2) - (h / 2);
                                                         //   return $window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
                                                         //   return true;
                                                         // }
  }
]);
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
]).constant('_', window._).constant('moment', window.moment).config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]).config([
  '$routeProvider',
  function config($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'home/home.html',
      controller: 'HomeCtrl',
      title: 'Home'
    }).when('/login', {
      templateUrl: 'auth/login.html',
      controller: 'LoginCtrl',
      title: 'Login'
    }).when('/appointments', {
      templateUrl: 'appointments/appointments.html',
      controller: 'AppointmentsCtrl',
      title: 'Appointments'
    }).when('/usersignin', {
      templateUrl: 'appointments/usersignin.html',
      controller: 'UserSigninCtrl',
      title: 'UserSignin'
    }).when('/usersignup', {
      templateUrl: 'appointments/usersignup.html',
      controller: 'UserSignupCtrl',
      title: 'UserSignup'
    }).when('/profile', {
      templateUrl: 'appointments/profile.html',
      controller: 'ProfileCtrl',
      title: 'Profile'
    });
  }
]).controller('AppCtrl', [
  '$scope',
  '$location',
  'usersession',
  function AppController($scope, $location, usersession) {
    var defaultPageTitle = 'Appoints';
    $scope.pageTitle = defaultPageTitle;
    $scope.$on('$routeChangeSuccess', function (ev, currentRoute) {
      if (angular.isUndefined) {
        $scope.pageTitle = defaultPageTitle;
      } else {
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
  }
]);