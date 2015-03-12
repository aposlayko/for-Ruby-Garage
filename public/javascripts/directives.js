'use strict';

/* Directives */

var marketDirectives = angular.module('taskDirectives', []),
    FLOAT_REGEXP = /^\d+((\.|\,)\d{1,2})?$/;

marketDirectives.directive('login', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/login.html',
        controller: 'loginCtrl',
        replace: true
    }
});

marketDirectives.directive('auth', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/auth.html',
        controller: 'authCtrl',
        replace: true
    }
});

marketDirectives.directive('passValidation', function () {
    var PASS_REGEXP = /[a-zA-Z0-9]{6,16}/i;

    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.pass = function(modelValue) {
                return ctrl.$isEmpty(modelValue) || PASS_REGEXP.test(modelValue);
            };
        }
    };
});

marketDirectives.directive('smartFloat', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (FLOAT_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(viewValue.replace(',', '.'));
                } else {
                    ctrl.$setValidity('float', false);
                    return undefined;
                }
            });
        }
    };
});