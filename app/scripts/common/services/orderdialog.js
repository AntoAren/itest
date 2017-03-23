'use strict';

angular.module('itest.portal.common.services')

.factory('orderDialog', function(ngDialog) {
    return {
        open: function(type, item) {
            return ngDialog.openConfirm({
                template: 'views/marketplace/common/orderdialog-template.html',
                closeByEscape: true,
                showClose: false,
                data: {
                    type: type,
                    item: item
                }
           });
        }
    };
});
