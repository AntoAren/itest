'use strict';

angular.module('itest.portal.common.directives')

.directive('headerMenu', function() {
    return {
        restrict: 'E',
        controller: 'HeaderCtrl',
        templateUrl: 'views/common/header.html'
    };
});
