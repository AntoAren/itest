'use strict';

angular.module('itest.portal.common.directives')

    .directive('resize', function ($window) {
        return {
            scope: {
                callback: '&resize'
            },
            link: function (scope) {
                var w = angular.element($window);
                var onResize = function () {
                    scope.$apply();
                };

                scope.getWindowDimensions = function () {
                    return {
                        'h': w.height(),
                        'w': w.width()
                    };
                };
                scope.$watch(scope.getWindowDimensions, function (newValue) {
                    scope.windowHeight = newValue.h;
                    scope.windowWidth = newValue.w;

                    scope.callback({w: scope.windowWidth, h: scope.windowHeight});
                }, true);

                w.on('resize', onResize);

                scope.$on('$destroy', function () {
                    w.off('resize', onResize);
                });
            }
        };
    });
