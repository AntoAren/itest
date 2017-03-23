'use strict';

angular.module('itest.portal.common.directives')

.directive('disableIf', function() {

    var waitingHTML = '<div class="waiting" ><div class="waiter"><div class="bar-1"></div><div class="bar-2"></div><div class="bar-3"></div>' +//jshint ignore: line
        '<div class="bar-4"></div><div class="bar-5"></div><div class="bar-6"></div><div class="bar-7"></div><div class="bar-8"></div>' +//jshint ignore: line
        '<div class="bar-9"></div><div class="bar-10"></div><div class="bar-11"></div><div class="bar-12"></div></div></div>';//jshint ignore: line

    var positionsForReplace = ['fixed', 'relative', 'absolut'];

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (positionsForReplace.indexOf(element.css('position')) === -1) {
                element.css('position', 'relative');
            }

            var waiting = $(waitingHTML);
            element.prepend(waiting);

            scope.$watch(attrs.disableIf, function(value) {
                if (value) {
                    waiting.show();
                } else {
                    waiting.hide();
                }
            });
        }
    };
});
