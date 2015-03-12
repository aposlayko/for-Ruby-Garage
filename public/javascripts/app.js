"use strict";

/* App Module */

var marketApp = angular.module('taskManager', [
    'ngRoute',
    'taskControllers',
    'taskDirectives'
]);

marketApp.config(['$routeProvider',
function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/main.html',
            controller: 'marketCtrl'
        }).
        /*when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl'
        }).
        when('/create', {
            templateUrl: 'partials/create.html',
            controller: 'createCtrl'
        }).
        when('/edit/:itemId', {
            templateUrl: 'partials/edit.html',
            controller: 'editCtrl'
        }).
        when('/edit-profile', {
            templateUrl: 'partials/edit-profile.html',
            controller: 'editProfileCtrl'
        }).
        when('/404', {
            templateUrl: 'partials/404.html'
        }).*/
        otherwise({
            redirectTo: '/404'
        });
}]);