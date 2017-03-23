'use strict';

angular.module('itest.portal.common.directives')

    .directive('owlCarousel', function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                options: '=owlCarouselOptions',
                selectedIndex: '=owlCarouselGoTo',
                enableKeyboard: '=owlEnableKeyboard'
            },
            link: function (scope, $element) {
                var $window = $(window);
                var owlCarouselAPI;
                var goToFirstPage = function () {
                    owlCarouselAPI.goTo(0);
                };
                var goToSelectedPage = function (index) {
                    owlCarouselAPI.jumpTo(index);
                };

                $element.addClass('owl-carousel');

                if (scope.enableKeyboard) {
                    $(document.documentElement).on('keyup', function (event) {
                        // handle cursor keys
                        if (event.keyCode === 37) {
                            $element.trigger('owl.prev');
                        } else if (event.keyCode === 39) {
                            $element.trigger('owl.next');
                        }
                    });
                }

                $window.on('resize', goToFirstPage);

                $timeout(function () {
                    $element.owlCarousel(scope.options);
                    owlCarouselAPI = $element.data('owlCarousel');
                    if (scope.selectedIndex) {
                        goToSelectedPage(scope.selectedIndex);
                    } else {
                        goToFirstPage();
                    }
                    $element.show();
                });
            }
        };
    });
