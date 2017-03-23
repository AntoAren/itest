'use strict';

angular.module('itest.portal.data.services')

    .factory('usersService', function(Restangular) {
        var restService = Restangular.one('users');

        return {
            getUsers: function(params) {
                return restService.get(params);
            },
            createUser: function (user) {
                return restService.customPOST(user);
            },
            deleteUser: function (username) {
                return restService.one(username).remove();
            },
            updatePassword: function (user) {
                return restService.one(user.username).one('password').customPUT(angular.toJson(user));
            },
            updateUser: function (user) {
                return restService.one(user.username).customPUT(user);
            },
            isDeleteAllowed: function (username) {
                return restService.one(username).one('is-delete-allowed').get();
            },
            updateTrkdCredentials: function (user) {
                var body = {
                    trkdCredentials: user.trkdCredentials
                };

                return restService.one(user.username).one('trkd-credentials').customPUT(body);
            }
        };
    });
