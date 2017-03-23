'use strict';

angular.module('itest.portal.data.services')

    .factory('userRegistrationService', function(Restangular) {
        var restService = Restangular.one('user-registration');

        return {
            createUser: function(user) {
                return restService.customPOST(user);
            },

            confirmUser: function(confirmationCode) {
                return restService.one('confirmation').put({code: confirmationCode});
            }
        };
    });
