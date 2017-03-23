'use strict';

angular.module('itest.portal.auth.directives')

    .directive('loginPage', function () {
        return {
            restrict: 'A',
            link: function (scope, $element) {
                var supportsOrientationChange = 'onorientationchange' in window;
                var orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize';
                var $window = $(window);

                var body = $('body');
                var metaViewport = $('meta[name=viewport]');
                var metaViewportDefaultContent = metaViewport.attr('content');
                var metaViewportContent = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
                var parent = $element.parent();
                var parentClass = parent.attr('class');

                var onOrientationChange = function () {
                    $window.scrollTop(0);
                };

                metaViewport.attr('content', metaViewportContent);
                body.addClass('login-page');
                parent.removeClass().addClass('content-wrapper-small');

                $window.on(orientationEvent, onOrientationChange);

                scope.$on('$destroy', function () {
                    metaViewport.attr('content', metaViewportDefaultContent);
                    body.removeClass('login-page');
                    parent.removeClass().addClass(parentClass);
                    $window.off(orientationEvent, onOrientationChange);
                });
            }
        };
    });
