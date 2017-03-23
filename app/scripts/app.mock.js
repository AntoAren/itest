'use strict';
angular.module('app.mock',[])
    .factory('MockInterceptor', mockInterceptor)
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('MockInterceptor');
    });

function mockInterceptor() {
    return {
        'request': function (config) {
            if (config.url.indexOf('/users') >= 0) {
                config.url = 'mockData/user.mock.json';
            } else if (config.url.indexOf('/tokens/identity') >= 0) {
                config.url = 'mockData/token.mock.json';
                config.method = 'GET';
            } else if (config.url.indexOf('/categories') >= 0) {
                config.url = 'mockData/categories.all.mock.json';
            } else if (config.url.indexOf('/topics') >= 0) {
                config.url = 'mockData/topics.all.mock.json';
            } else if ((config.url.indexOf('/tests') >= 0) && config.params && (config.params.view === 'myResults' || config.params.view === 'allTests' || config.params.view === 'assignedToMe' || config.params.view === 'createdByMe')) {
                config.url = 'mockData/tests.all.mock.json';
            } else if (config.url.indexOf('/tests/1') >= 0) {
                config.url = 'mockData/test.mock.json';
            }

            return config;
        }
    };
}

angular.module('itest.portal').requires.push('app.mock');
