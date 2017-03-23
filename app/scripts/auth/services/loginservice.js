'use strict';

angular.module('itest.portal.auth.services')

    .factory('loginService', function (authSession, userService) {
        return {
            createSession: function (username, identityToken, isAnonymous, refreshIdentityToken, identityTokenExpIn, issueDate) {
                authSession.create(identityToken, isAnonymous, refreshIdentityToken, identityTokenExpIn, issueDate);
                return userService.one(username).get()
                    .then(function (response) {
                        authSession.setUsername(response.username);
                        authSession.setDisplayName(response.displayName);
                        authSession.setUserRoles(response.authorities);
                    }, function () {
                        authSession.destroy();
                    });
            }
        };
    });
