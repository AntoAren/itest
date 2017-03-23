'use strict';

angular.module('itest.portal.data.services')

    .factory('tokenService', function(Restangular, CONFIG, $base64) {
        var tokensService = Restangular.all('tokens');

        var escapingTheStringBeforeEncoding = function (str) {
            return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
                return String.fromCharCode('0x' + p1);
            });
        };

        return {
            createIdentityToken: function(username, password, data) {
                // base64 encode non latin symbols
                // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
                var escapingString = escapingTheStringBeforeEncoding(username + ':' + password);

                var headers = {
                    Authorization: 'Basic ' + $base64.encode(escapingString)
                };

                return tokensService.customPOST(data, 'identity', {}, headers);
            },

            createAccessTokenByIdentityToken: function(data, token, username, lifetime) {
                var headers;
                var params = {user: username};

                if (token === '') { // for anonymus user
                    token = CONFIG.anonymousIdentityToken;
                }

                headers = {Authorization: 'Bearer ' + token};

                if (lifetime) {
                    params.lifetime = lifetime;
                }
                return tokensService.customPOST(data, 'access', params, headers);
            },

            createAccessTokenUsingThirdPartyToken: function (organizationId, token, data) {
                var headers = {Authorization: 'Bearer ' + token};

                return tokensService.customPOST(data, 'access/using-third-party-token',
                {organizationId: organizationId}, headers);
            },

            createIdentityTokenUsingThirdPartyToken: function (organizationId, token, data) {
                var headers = {Authorization: 'Bearer ' + token};

                return tokensService.customPOST(data, 'identity/using-third-party-token',
                {organizationId: organizationId}, headers);
            },

            refreshAccessToken: function (token, refreshToken) {
                var headers = {Authorization: 'Bearer ' + token};
                var data = {
                    refreshToken: refreshToken
                };

                return tokensService.customPOST(data, 'refresh/access', {}, headers);
            },

            refreshIdentityToken: function (token, refreshToken) {
                var headers = {Authorization: 'Bearer ' + token};
                var data = {
                    refreshToken: refreshToken
                };

                return tokensService.customPOST(data, 'refresh/identity', {}, headers);
            }
        };
    });
