'use strict';

angular.module('itest.portal.createdbyme.directives')

    .directive('createdByMePlate', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/createdbyme/createdbymeplate.html'
        };
    });
