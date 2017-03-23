'use strict';

angular.module('itest.portal.common.directives')

.directive('orderButton', function(authSession, notifier, orderDialog, dataSourceOrderService, widgetOrderService) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div disable-if="orderProcessing" class="order-btn-container">' +
        '<div class="btn" href="" ng-show="visible && !isOwner" ng-bind="text" ng-class="class"' +
        ' ng-click="openOrderDialog()"/></div>',
        scope: {
            item: '=',
            type: '@'
        },
        link: function(scope) {
            var createOrderFn = {
                widget: widgetOrderService.createWidgetOrder,
                dataSource: dataSourceOrderService.createDatasourceOrder
            };
            var canBeOrdered;

            scope.openOrderDialog = function() {
                if (canBeOrdered) {
                    orderDialog.open(scope.type, scope.item).then(function() {
                        scope.orderProcessing = true;

                        createOrderFn[scope.type](scope.item.urn || scope.item.id).then(function() {
                            scope.item.ordered = true;
                            notifier.success('The order has been successfully created.');
                        }).finally(function() {
                            scope.orderProcessing = false;
                        });
                    });
                }
            };

            scope.$watch('item', function() {
                if (scope.item) {
                    canBeOrdered = authSession.isOrganizationAdmin() &&
                        !(scope.item.subscribed || scope.item.ordered || scope.item.privatelyAccessible ||
                        scope.item.own);
                    scope.isOwner = scope.item.own;

                    if (canBeOrdered) {
                        scope.text = 'order';
                        scope.class = 'btn-brand';
                        scope.visible = true;
                    } else if (scope.item.subscribed && (!scope.item.privatelyAccessible || scope.item.own)) {
                        scope.text = 'subscribed';
                        scope.class = 'btn-green pointer-disabled';
                        scope.visible = true;
                    } else if (authSession.isOrganizationAdmin() && scope.item.ordered &&
                            (!scope.item.privatelyAccessible || scope.item.own)) {
                        scope.text = 'ordered';
                        scope.class = 'btn-plum pointer-disabled';
                        scope.visible = true;
                    } else {
                        scope.text = '';
                        scope.visible = false;
                    }
                }
            }, true);
        }
    };
});
