'use strict';

angular.module('itest.portal.data.services')

.factory('testService', function($window, Restangular) {
    var restService = Restangular.one('tests');

    return {

        getTestsAllTests: function(testParams) {
            var params;

            testParams = testParams || {};
            params = {
                category: testParams.category,
                topic: testParams.topic,
                search: testParams.search,
                sort: testParams.sort,
                offset: testParams.offset,
                max: testParams.max,
                order: testParams.order,
                view: 'allTests'
            };

            return restService.get(params);
        },

        getTestsAssignedToMe: function(testParams) {
            var params;

            testParams = testParams || {};
            params = {
                category: testParams.category,
                topic: testParams.topic,
                search: testParams.search,
                sort: testParams.sort,
                offset: testParams.offset,
                max: testParams.max,
                order: testParams.order,
                view: 'assignedToMe'
            };

            return restService.get(params);
        },

        getTestsMyResults: function(testParams) {
            var params;

            testParams = testParams || {};
            params = {
                category: testParams.category,
                topic: testParams.topic,
                search: testParams.search,
                sort: testParams.sort,
                offset: testParams.offset,
                max: testParams.max,
                order: testParams.order,
                view: 'myResults'
            };

            return restService.get(params);
        },

        getTestsCreatedByMe: function(testParams) {
            var params;

            testParams = testParams || {};
            params = {
                category: testParams.category,
                topic: testParams.topic,
                search: testParams.search,
                sort: testParams.sort,
                offset: testParams.offset,
                max: testParams.max,
                order: testParams.order,
                view: 'createdByMe'
            };

            return restService.get(params);
        },

        createTest: function(test) {
            return restService.customPOST(test);
        },

        getTest: function(testId) {
            return restService.one(testId).get();
        },

        editTest: function(testId, testParams) {
            return restService.one(testId).put(testParams);
        }
    };
});
