'use strict';

angular.module('itest.portal.common.directives')

.directive('showTooltip', function() {
    return {
        restrict: 'A',
        link: function(scope) {
            scope.showTooltip = false;

            scope.widthChecker = function (event) {
                var $parent = $(event.delegateTarget);
                var $child = $(event.delegateTarget).find('.value');
                var browser = detect.parse(navigator.userAgent); // jshint ignore: line

                if (browser.browser.family === 'IE') {
                    scope.showTooltip = $child.text().length * 8.5 >= $parent.width();
                } else {
                    scope.showTooltip = $child.width() >= $parent.width();
                }
            };
        }
    };
});
