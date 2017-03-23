'use strict';

angular.module('itest.portal.common.directives')

.directive('errorSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src !== attrs.errorSrc) {
                    attrs.$set('src', attrs.errorSrc);
                }
            });

            attrs.$observe('ngSrc', function(value) {
            if (!value && attrs.errSrc) {
              attrs.$set('src', attrs.errSrc);
            }
          });
        }
    };
});
