'use strict';

angular.module('itest.portal.common.services')
    .factory('previousStateService', function() {
        var previousState = null;

        var pushPreviousState = function (stateName, stateParams) {
            previousState = {
                name: stateName,
                params: stateParams || {}
            };
        };

        var popPreviousState = function() {
            var state = previousState;

            previousState = null;
            return state;
        };

        return {
            pushPreviousState: pushPreviousState,
            popPreviousState: popPreviousState
        };
    });
