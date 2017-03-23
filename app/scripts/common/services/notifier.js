'use strict';

angular.module('itest.portal.common.services')

    .factory('notifier', function ($rootScope) {

        var notify = function (data) {
            $rootScope.$emit('notifier:newNotification', data);
        };

        var success = function (data) {
            notify({message: data.message, type: 'success', header: data.title || 'Success'});
        };

        var warn = function (data) {
            notify({message: data.message, type: 'warning', header: data.title || 'Warning'});
        };

        var error = function (data) {
            notify({message: data.message, type: 'error', header: data.title || 'Error'});
        };

        var info = function (data) {
            notify({message: data.message, type: 'info', header: data.title || 'Information'});
        };

        return {
            success: success,
            error: error,
            warn: warn,
            info: info
        };
    });
