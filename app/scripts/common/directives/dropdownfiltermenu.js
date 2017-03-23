'use strict';

angular.module('itest.portal.common.directives')

.directive('dropdownfilterMenu', function() {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngChange: '&',
            defaultTitle: '=',
            type: '=',
            model: '=ngModel',
            scrollable: '='
        },
        templateUrl: 'views/common/dropdownfilter-menu.html',
        link: function ($scope, element, attrs, ngModel) {
            var itemsBackup = [];
            var getCurrentItem = function() {
                var i;

                if ($scope.items) {
                    for (i = 0; i < $scope.items.length; i++) {
                        if ($scope.items[i].selected) {
                            return $scope.items[i];
                        }
                    }
                }
            };

            if (!ngModel) {
                return;
            }

            $scope.title = $scope.defaultTitle;
            $scope.items = ngModel.$modelValue;

            ngModel.$render = function() {
                itemsBackup = ngModel.$modelValue;
                $scope.items = itemsBackup;
                $scope.currentItem = getCurrentItem();
            };

            $scope.$watch('model', function() {
                ngModel.$render();
            }, true);

            $scope.selectedItemChanged = function(selectedItem) {
                if ($scope.currentItem) {
                    $scope.currentItem.selected = false;
                }
                if (!$scope.clearSelection) {
                    $scope.currentItem = selectedItem;
                    $scope.currentItem.selected = true;
                }
                $scope.expanded = false;

                if ($scope.ngChange) {
                    $scope.ngChange({
                        selectedItem: selectedItem
                    });
                }
            };
        }
    };
});
