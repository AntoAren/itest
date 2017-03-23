'use strict';

angular.module('itest.portal.common.directives')

    .directive('notification', function ($rootScope, $timeout, $document) {
        var timer;
        var timeout = {
            success: 4000,
            error: 5000,
            warning: 4000,
            info: 5000
        };

        var fadeOutNotification = function (scope, element) {
            element.stop(true).fadeOut(500, function () {
                scope.$apply(function () {
                    scope.hideNotification = true;
                });
            });
        };

        var proccessNotification = function (scope, element, type, message, header) {
            scope.hideNotification = false;
            scope.notificationClass = 'notification-' + type;
            scope.message = message;
            scope.header = header;

            element.show();
            $timeout.cancel(timer);
            timer = $timeout(function () {
                fadeOutNotification(scope, element);
            }, timeout[type]);
        };

        return {
            restrict: 'E',
            scope: true,
            replace: true,
            templateUrl: 'views/common/notification.html',
            link: function ($scope, element) {
                var closeOnOutsideClick = function (event) {
                    var clickOutside = $(event.target).closest(element).length === 0;

                    if (clickOutside) {
                        $document.off('mouseup', closeOnOutsideClick);
                        $scope.$apply(function() {
                            $scope.hideNotification = true;
                        });
                    }
                };

                $scope.hideNotification = true;
                $rootScope.$on('notifier:newNotification', function (event, data) {
                    $document.on('mouseup', closeOnOutsideClick);
                    proccessNotification($scope, element, data.type, data.message, data.header);
                });

                $scope.onClose = function () {
                    $scope.hideNotification = true;
                    $document.off('mouseup', closeOnOutsideClick);
                    $timeout.cancel(timer);
                };

                $scope.cancelTimeout = function () {
                    $timeout.cancel(timer);
                };
            }
        };
    });
