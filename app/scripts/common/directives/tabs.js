'use strict';

angular.module('itest.portal.common.directives')

    .directive('tabset', function ($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            controller: 'TabsetCtrl',
            templateUrl: 'views/common/tabset.html',
            scope: {
                mode: '@',
                contentClass: '@',
                scrollable: '='
            },
            link: function (scope, $elm, attrs, tabsetCtrl) {
                var maxX = 0;
                var isInit = false;
                var $titlesContainer = $elm.find('.tabs-titles');
                var $doc = $(document);
                var currentPosition = 0;

                var getCoords = function (elem) {
                    var box = elem.getBoundingClientRect();

                    return {
                        top: box.top + window.pageYOffset,
                        left: box.left + window.pageXOffset
                    };
                };

                var containerCoords = getCoords($elm[0]);

                var moveAt = function (x) {
                    currentPosition = x;

                    $titlesContainer.css({'transform': 'translate3d(' + currentPosition + 'px, 0px, 0px)'});
                };

                var moveAtInRangeBounds = function (x) {
                    if (x > 0) {
                        moveAt(0);
                    } else if (x < maxX) {
                        moveAt(maxX);
                    } else {
                        moveAt(x);
                    }
                };

                var getX = function (event) {
                    return event.type.indexOf('touch') === 0 ? event.originalEvent.touches[0].pageX : event.pageX;
                };

                var addTabsHandlers = function () {
                    $elm.on('mousedown touchstart', function (mouseDownEvent) {
                        var mouseDownX = getX(mouseDownEvent) - containerCoords.left;
                        var shiftX = mouseDownX - currentPosition;

                        $doc.one('mousemove touchmove', function () {
                            $elm.addClass('mousemove');
                        });

                        $doc.on('mousemove touchmove', function (mouseMoveEvent) {
                            var mouseMoveX = getX(mouseMoveEvent) - containerCoords.left;

                            moveAt(mouseMoveX - shiftX);
                        });

                        $doc.on('mouseup touchend', function () {
                            $doc.off('mousemove touchmove');
                            $doc.off('mouseup touchend');
                            $elm.removeClass('mousemove');

                            moveAtInRangeBounds(currentPosition);
                        });
                    });

                    $elm.on('click', 'li', function () {
                        var elX = -(getCoords(this).left - containerCoords.left);

                        moveAtInRangeBounds(elX + currentPosition + 50); // 50 - shift to display next item
                    });

                    $elm.on('dragstart', function () {
                        return false;
                    });

                    isInit = true;
                };

                var removeTabsHandlers = function () {
                    $elm.off('mousedown touchstart dragstart click');
                    isInit = false;
                };

                var initTabs = function () {
                    maxX = $elm.width() - $titlesContainer.width();

                    if (!isInit && maxX < 0) {
                        addTabsHandlers();
                    } else if (isInit && maxX >= 0) {
                        removeTabsHandlers();
                    }
                };

                var onResize = function () {
                    containerCoords = getCoords($elm[0]);
                    initTabs();
                    moveAt(0);
                };

                scope.$on('tabset.active', function (event, tabHeading) {
                    var selectedTab = tabsetCtrl.getTabByHeading(tabHeading);

                    if (selectedTab) {
                        tabsetCtrl.select(selectedTab);
                    }
                });

                if (scope.scrollable) {
                    scope.$watch('tabs.length', function () {
                        $timeout(function () {
                            initTabs();
                        }, 0);
                    });

                    $(window).on('resize', onResize);

                    scope.$on('$destroy', function () {
                        moveAt(0);
                        $(window).off('resize', onResize);
                    });
                }
            }
        };
    })

    .directive('tab', function ($state) {
        return {
            require: '^tabset',
            restrict: 'EA',
            replace: true,
            template: '<div class="tab-content-block" ng-class="{selected: active}" ng-transclude></div>',
            transclude: true,
            scope: {
                active: '=?',
                heading: '@',
                state: '@',
                onSelect: '&select',
                onDeselect: '&deselect'
            },
            compile: function (elm, attrs, transclude) {
                return {
                    post: function postLink(scope, elm, attrs, tabsetCtrl) {
                        scope.$watch('active', function (active) {
                            if (active) {
                                tabsetCtrl.select(scope);
                            }
                        });

                        scope.onSelect = scope.onSelect || function () {
                        };

                        scope.select = function (event) {
                            if (event.button === 0) {
                                scope.active = true;
                            }
                        };

                        tabsetCtrl.addTab(scope);

                        scope.$on('$destroy', function () {
                            tabsetCtrl.removeTab(scope);
                        });

                        scope.$transcludeFn = transclude;
                    },
                    pre: function preLink(scope) {
                        scope.link = $state.href(scope.state);
                    }
                };
            }
        };
    });
