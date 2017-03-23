'use strict';

angular.module('itest.portal.common.services')

.factory('deleteDialog', function(confirmDialog) {
    return {
        open: function(title) {
            return confirmDialog.open({
                title: title,
                message: 'You won\'t be able to undo delete action. Are you still want to continue?',
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                type: 'delete'
            });
        }
    };
});
