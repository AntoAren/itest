'use strict';

angular.module('itest.portal.common.filters')

    .filter('join', function () {
        return function (input, separator) {
            return input.join(separator);
        };
    });
