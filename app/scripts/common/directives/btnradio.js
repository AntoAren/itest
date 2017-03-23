'use strict';

angular.module('itest.portal.common.directives')

.directive('btnRadio', function() {
    return {
        require: '?ngModel',
        /* jshint maxparams: 4 */
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$render = function() {
                if (attrs.btnRadio === modelCtrl.$modelValue) {
                    element.addClass('selected');
                } else {
                    element.removeClass('selected');
                }
            };

            element.click(function() {
                element.addClass('selected');
                scope.$apply(function(){
                    modelCtrl.$setViewValue(attrs.btnRadio);
                });
            });
        }
    };
});
