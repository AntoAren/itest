'use strict';

angular.module('itest.portal.common.directives')

    .directive('pageHeader', function () {
        return {
            restrict: 'E',
            scope: {
                scrollTo: '@',
                header: '@',
                backTo: '@'
            },
            templateUrl: 'views/common/pageheader.html'
        };
    });
