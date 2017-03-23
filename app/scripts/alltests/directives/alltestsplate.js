'use strict';

angular.module('itest.portal.all.directives')

.directive('allTestPlate', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/alltests/alltestsplate.html'
    };
});
