'use strict';

angular.element(document).ready(function () {
    $.ajax({
        url: 'config.json',
        type: 'GET',
        success: function (response) {
            angular.module('itest.portal').constant('CONFIG', response);
            angular.bootstrap(document, ['itest.portal']);
        },
        error: function () {
            window.location.href = '/error.html';
        }
    });
});
