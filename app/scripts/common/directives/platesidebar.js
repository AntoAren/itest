'use strict';

angular.module('itest.portal.common.directives')

.directive('plateSidebar', function($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'views/common/platesidebar.html',
        link: function($scope, $element) {
            var $toggleButtonChevron = $element.find('.chevron-icons');
            var $toggleButtonMenu = $element.find('.sidebar-toggle');

            var toggleMenu = function (event) {
                var $elem = $('.sidebar');

                if (event.data === 'chevron') {
                    if ($('body').width() <= 740) {
                        $elem.toggleClass('menu-open');
                        $elem.removeClass('menu-close');
                    } else {
                        $elem.toggleClass('menu-close');
                        $elem.removeClass('menu-open');
                        $elem.closest('.sandbox-page').toggleClass('menu-open');
                    }
                } else {
                    $elem.removeClass('menu-close');
                    $elem.toggleClass('menu-open');
                }
            };

            var setSidebarHeight = function() {
                var windowHeight = $(window).height();
                var headerHeight = $('.header').outerHeight();
                var navHeight = $('.nav-container').outerHeight();
                var footerHeight = $('.footer').outerHeight();
                var sidebarHeight = windowHeight - headerHeight - navHeight - footerHeight;

                sidebarHeight = sidebarHeight >= 600 ? sidebarHeight : 600;

                $('.sidebar').css('min-height', sidebarHeight);
            };

            $(window).resize(setSidebarHeight);

            $timeout(setSidebarHeight);

            $element.closest('.sandbox-page').toggleClass('menu-open');

            $toggleButtonChevron.click('chevron', toggleMenu);
            $toggleButtonMenu.click('menu', toggleMenu);
        }
    };
});
