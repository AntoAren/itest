'use strict';

angular.module('itest.portal.common.directives')

.directive('infiniteScroll', function($window, $document) {
    return {
        link: function (scope, element, attrs) {
            $window = angular.element($window);

            var scrollHandler = function() {
                if ($document.height() - $window.height() - $document.scrollTop() <= 300) {
                    scope.$apply(attrs.infiniteScroll);
                }
            };

            scope.$watch(attrs.infiniteScrollStop, function(value) {
                if (value) {
                    $window.unbind('scroll', scrollHandler);
                } else {
                    $window.bind('scroll', scrollHandler);
                }
            });

            scope.$on('$destroy', function() {
                $window.unbind('scroll', scrollHandler);
            });
          }
    };
});
