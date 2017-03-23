'use strict';

angular.module('itest.portal.common.services')

    .factory('confirmDialog', function (ngDialog, $sce) {
        return {
            open: function (opts) {
                var defaultOptions = {
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    type: 'confirm'
                };

                var options = angular.extend(defaultOptions, opts);

                return ngDialog.openConfirm({
                    template: 'views/common/confirmdialogtempalte.html',
                    closeByEscape: true,
                    showClose: false,
                    data: {
                        title: options.title,
                        type: options.type,
                        message: $sce.trustAsHtml(options.message),
                        confirmButtonText: options.confirmButtonText,
                        cancelButtonText: options.cancelButtonText
                    }
                });
            }
        };
    });
