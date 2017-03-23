'use strict';

angular.module('itest.portal.myresults.directives')

    .directive('myResultsPlate', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/myresults/myresultsplate.html'
        };
    });
