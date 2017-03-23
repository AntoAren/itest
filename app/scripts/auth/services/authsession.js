'use strict';

angular.module('itest.portal.auth.services')

    .factory('authSession', function(localStorageService, $base64, $rootScope, tokenService) {
        var KEY = 'authData';
        var authData = localStorageService.get(KEY);

        return {
            create: function(identityToken, isAnonymous, refreshIdentityToken, identityTokenExpIn, issueDate) {
                authData = {
                    identityToken: identityToken,
                    isAnonymous: isAnonymous,
                    refreshIdentityToken: refreshIdentityToken,
                    identityTokenExpIn: identityTokenExpIn,
                    issueDate: issueDate
                };

                localStorageService.set(KEY, authData);
            },
            replaceTokens: function (identityToken, refreshIdentityToken, identityTokenExpIn, issueDate) {
                authData.identityToken = identityToken;
                authData.refreshIdentityToken = refreshIdentityToken;
                authData.identityTokenExpIn = identityTokenExpIn;
                authData.issueDate = issueDate;

                localStorageService.set(KEY, authData);
            },
            destroy: function() {
                authData = undefined;
                localStorageService.remove(KEY);
            },
            getIdentityToken: function() {
                return authData ? authData.identityToken : '';
            },
            setDisplayName: function(displayName) {
                if (authData) {
                    authData.displayName = displayName;
                    localStorageService.set(KEY, authData);
                }
            },
            getDisplayName: function() {
                return authData ? authData.displayName : '';
            },
            setUserRoles: function(userRoles) {
                var i;

                if (authData) {
                    authData.userRoles = [];
                    for (i = 0; i < userRoles.length; i++) {
                        if (userRoles[i].hasOwnProperty('name')) {
                            authData.userRoles.push(userRoles[i].name);
                        }
                    }
                    localStorageService.set(KEY, authData);
                }
            },
            getUserRoles: function() {
                return authData ? authData.userRoles : [];
            },
            setUsername: function(username) {
                if (authData) {
                    authData.userame = username;
                    localStorageService.set(KEY, authData);
                }
            },
            getUsername: function() {
                return authData ? authData.userame : '';
            },
            isAuthenticated: function() {
                if (!authData || authData.isAnonymous || this.isTokenExpired() ||
                    !authData.refreshIdentityToken){ // added for users without refresh token field in authData
                    // should be removed after release 1.65
                    return false;
                }
                return this.getIdentityToken() ? true : false;
            },
            isAdmin: function() {
                return this.getUserRoles().indexOf('ROLE_ADMIN') >= 0;
            },
            isDeveloper: function() {
                return this.getUserRoles().indexOf('ROLE_DEVELOPER') >= 0;
            },
            isAnonymous: function() {
                return authData.isAnonymous;
            },
            isTokenExpired: function () {
                if (authData && !authData.isAnonymous) {
                    return this.expiredChecker(authData);
                } else {
                    return false;
                }
            },
            expiredChecker: function (authData) {
                var identityTokenExpDate = authData.issueDate + authData.identityTokenExpIn;
                var currentDate = Date.now();
                var warningIdentityPeriod = authData.identityTokenExpIn / 4;
                var expiredIdentityPeriod = authData.identityTokenExpIn / 100;

                if ((identityTokenExpDate - currentDate) <= warningIdentityPeriod) {
                    if ((identityTokenExpDate - currentDate) <= expiredIdentityPeriod) {
                        return true;
                    } else {
                        this.refreshTokens();
                        return false;
                    }
                } else {
                    return false;
                }
            },
            refreshTokens: function () {
                var that = this;

                tokenService.refreshIdentityToken(authData.identityToken, authData.refreshIdentityToken)
                    .then(function(responseIdentity) {
                        var issueDate = Date.now();
                        that.replaceTokens(responseIdentity.identityToken, responseIdentity.refreshToken, responseIdentity.expiresIn, issueDate);
                    });
            }
        };
    });
