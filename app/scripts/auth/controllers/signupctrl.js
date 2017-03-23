'use strict';

angular.module('itest.portal.auth.controllers')

    .controller('SignupCtrl', function($scope, $state, CONFIG, userRegistrationService, notifier, $window, $rootScope) {

        $scope.itestPortalEndpoint = CONFIG.itestPortalEndpoint;
        $scope.goHome = $rootScope.previousStateName === 'login';

        $scope.user = {
            username: '',
            password: '',
            passwordConfirm: ''
        };

        $scope.signUp = function() {
            $scope.submittingForm = true;

            userRegistrationService.createUser($scope.user).then(function (response) {
                $state.go('login');
                notifier.success({message: response.message});
            }).finally(function() {
                $scope.submittingForm = false;
            });
        };

        $scope.closeHref = $scope.goHome ? $scope.itestPortalEndpoint : '';

        $scope.close = function () {
            if (!$scope.goHome) {
                if ($rootScope.previousStateName === '') {
                    $window.history.back();
                } else {
                    $state.go($rootScope.previousStateName, {}, {location: 'replace'});
                }
            }
        };
    });
