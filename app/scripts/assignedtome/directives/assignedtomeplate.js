'use strict';

angular.module('itest.portal.assignedtome.directives')

    .directive('assignedToMePlate', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/assignedtome/assignedtomeplate.html'
        };
    });
