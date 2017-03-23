'use strict';

angular.module('itest.portal', [
        'restangular',
        'base64',
        'LocalStorageModule',
        'ngDialog',
        'ui.bootstrap.dropdown',
        'ui.bootstrap.position',
        'color.picker',
        'vcRecaptcha',
        'ui.date',
        'itest.portal.routing',
        'itest.portal.common',
        'itest.portal.auth',
        'itest.portal.data',
        'itest.portal.all',
        'itest.portal.assignedtome',
        'itest.portal.myresults',
        'itest.portal.createdbyme',
        'itest.portal.createnewtest',
        'itest.portal.edittest'
    ])
    .config(function (RestangularProvider, CONFIG) {
        RestangularProvider.setBaseUrl(CONFIG.restServicesEndpoint);
    })
    .run(function ($rootScope, $state, Restangular, CONFIG, authSession, $window, notifier, previousStateService) {

        var publicStates = [
            'login',
            'logout',
            'signup'
        ];

        $rootScope.itestPortalEndpoint = CONFIG.itestPortalEndpoint;

        // makes security checks and fills some common fields of root scope
        // redirects to another scope in case of support or security violations
        $rootScope.$on('$stateChangeStart', function (event, toState, params) {
            var redirectToAnotherScope;
            var isPublicStateRequested = publicStates.indexOf(toState.name) !== -1;
            var userIsNotAuthenticated = authSession.isAuthenticated() === false;

            if (userIsNotAuthenticated && isPublicStateRequested === false) {
                previousStateService.pushPreviousState(toState.name, params);
                redirectToAnotherScope = { name: 'login' };
            }

            if (redirectToAnotherScope) {
                $state.go(redirectToAnotherScope.name, redirectToAnotherScope.params || {}, { location: 'replace' });
                event.preventDefault();
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            $rootScope.title = toState.title;
        });

        Restangular.setFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) { // jshint ignore:line
            headers.Authorization = 'Bearer '+ authSession.getIdentityToken();

            return {
                element: element,
                params: params,
                headers: headers,
                httpConfig: httpConfig
            };
        });

        // used to add in every restangular promise method:
        // disableDefaultErrorNotification(predicate)
        // if used without parameter will disable default notification
        // if used with predicate than predicate return value is used
        // predicate parameter - error response
        // example:
        // preferenceService.getWidgetPreferences($stateParams.widgetId)
        //      .disableDefaultErrorNotification(function (response) {
        //          if (response.status === 404 || response.status === 400) {
        //              return true;
        //          }
        //      })
        //      .then(function (response) {
        //          ...
        //      });
        Restangular.setRestangularizePromiseInterceptor(function (promise) {
            promise.disableDefaultErrorNotification = function (predicate) {
                this.__skipNotification = predicate || function () {
                    return true;
                };

                return this;
            };
        });

        // used to display default error message notification for each error response
        // in order to override this behaviour use disableDefaultErrorNotification method
        // described above in setRestangularizePromiseInterceptor
        Restangular.setErrorInterceptor(function (response, deferred) {
            var errorMessage;
            var skipNotification = deferred.promise.__skipNotification;

            if (response.data && response.data.message) {
                errorMessage = response.data.message;
            } else {
                errorMessage = 'Remote server is not available. Please try later.';
            }

            if (skipNotification && skipNotification(response)) {
                return true;
            }

            notifier.error({
                message: errorMessage
            });

            return true;
        });
    });
