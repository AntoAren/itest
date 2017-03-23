'use strict';

angular.module('itest.portal.auth.controllers')

    .controller('LoginCtrl', function ($scope, $rootScope, $location, $state, authService, authSession, loginService, previousStateService, notifier) {
        $scope.state = 'login';

        if (authSession.isAuthenticated()) {
            $state.go('home');
            return;
        }

        if (authSession.isTokenExpired()) {
            notifier.warn({
                message: 'Your login session has been expired. Please relogin.'
            });
        }

        $scope.user = {
            username: '',
            password: ''
        };

        $scope.closeHref = $scope.itestPortalEndpoint;

        $scope.login = function () {
            var requestedState = previousStateService.popPreviousState() || { name: 'home', params: {} };

            $scope.submitting = true;
            $scope.authError = false;

            authService.authenticate($scope.user)
                .then(function (response) {

                    var issueDate = Date.now();
                    loginService.createSession($scope.user.username, response.identityToken, false, response.refreshToken,
                        response.expiresIn, issueDate)
                        .then(function () {
                            $rootScope.$broadcast('login:success');
                            $state.go(requestedState.name, requestedState.params);
                        })
                        .finally(function () {
                            $scope.submiting = false;
                        });
                }, function () {
                    $scope.user.password = '';
                    $scope.submitting = false;
                    $scope.state = 'login';
                    $scope.authError = true;
                });
        };
    });
