'use strict';

angular.module('itest.portal.common.directives')

.directive('dropdownMenu', function() {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            entity: '=',
            actionByStatus: '='
        },
        templateUrl: 'views/common/dropdown-menu.html'
    };
});
