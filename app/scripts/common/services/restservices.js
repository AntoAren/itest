'use strict';

angular.module('itest.portal.common.services')

.factory('userService', function(Restangular) {
    return Restangular.service('users');
});
