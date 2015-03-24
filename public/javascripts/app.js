"use strict";

/* App Module */

var marketApp = angular.module('taskManager', [
    'ngRoute',
    'taskControllers',
    'taskDirectives',
    'taskFilters'
]);

marketApp.config(['$routeProvider', '$locationProvider',
function ($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/task-manager.html',
            controller: 'taskManagerCtrl'
        }).
        when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl'
        }).
        when('/edit-profile', {
            templateUrl: 'partials/edit-profile.html',
            controller: 'editProfileCtrl'
        }).
        when('/404', {
            templateUrl: 'partials/404.html'
        }).
        otherwise({
            redirectTo: '/404'
        });

    $locationProvider.html5Mode(true);
}]);