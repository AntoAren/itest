'use strict';

angular.module('itest.portal.common.directives', []);

angular.module('itest.portal.common.services', []);

angular.module('itest.portal.common.controllers', []);

angular.module('itest.portal.common.filters', []);

angular.module('itest.portal.common', [
    'itest.portal.common.directives',
    'itest.portal.common.controllers',
    'itest.portal.common.services',
    'itest.portal.common.filters'
]);

