'use strict';

angular.module('itest.portal.common.directives')

.directive('navigation', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/common/navigation.html'
    };
});
