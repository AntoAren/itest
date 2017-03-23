'use strict';

angular.module('itest.portal.auth.controllers')

.controller('LogoutCtrl', function($state, authSession, $rootScope) {
    authSession.destroy();
    $rootScope.$broadcast('logout:success');
    $state.go('login', {}, {location: 'replace'});
});
