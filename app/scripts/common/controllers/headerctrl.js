'use strict';

angular.module('itest.portal.common.controllers')

.controller('HeaderCtrl', function($scope, $rootScope, $window, authSession, CONFIG) {
    var setUserInfo = function() {
        $scope.username = authSession.getDisplayName();
        $scope.email = authSession.getUsername();
        $scope.isAdmin = authSession.isAdmin();
        $scope.isDeveloper = authSession.isDeveloper();
    };

    $scope.itestPortalEndpoint = CONFIG.itestPortalEndpoint;

    $scope.$on('login:success', function() {
        setUserInfo();
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        $scope.state = toState.name.slice(0, toState.name.indexOf('.'));
    });

    setUserInfo();
});
