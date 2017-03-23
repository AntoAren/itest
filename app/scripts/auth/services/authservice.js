'use strict';

angular.module('itest.portal.auth.services')

    .factory('authService', function (CONFIG, tokenService, $q, authSession) {

        var identityData = {
            scope: {}
        };

        return {
            authenticate: function (user) {
                return tokenService.createIdentityToken(user.username, user.password, identityData);
            },
            authenticateAnonymousUser: function (username) {
                return tokenService.createAccessTokenByIdentityToken(identityData,
                    authSession.getIdentityToken(), username, null);
            }
        };
    });
