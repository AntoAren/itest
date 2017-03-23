'use strict';

angular.module('itest.portal.data.services')

    .factory('topicService', function (Restangular) {
        var restService = Restangular.one('topics');

        return {
            getTopicsForPublicTests: function () {
                var params = {
                    view: 'all'
                };

                return restService.get(params);
            }
        };
    });
