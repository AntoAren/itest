'use strict';

angular.module('itest.portal.common.directives')

    .directive('searchInput', function($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'views/common/searchinput.html',
            scope: {
                action: '=',
                placeholder: '@',
                defaultValue: '='
            },
            link: function($scope, $element) {
                var $searchInputWrapper = $element.find('.search-input-wrapper');
                var $searchInput = $searchInputWrapper.find('input');
                var $searchIcon = $searchInputWrapper.find('.search-icon');
                var $clearIcon = $searchInputWrapper.find('.clear-icon');
                var $searchPlaceholder = $searchInputWrapper.find('p');
                var isOpen = false;
                var eventIsOn = false;
                var timer = null;

                var closeSearch = function () {
                    if (isOpen && !$searchInput.val()) {
                        $element.removeClass('search-input-is-active');
                        $clearIcon.removeClass('active');
                        $searchInput.val('');
                        isOpen = false;
                    }
                };

                var openSearch = function () {
                    if (!isOpen) {
                        $element.addClass('search-input-is-active');
                        isOpen = true;
                    } else {
                        closeSearch();
                    }
                    $searchInput.focus();
                };

                var search = function (event) {
                    var searchValue = event ? event.target.value.toLowerCase() : '';

                    if (timer) {
                        $timeout.cancel(timer);
                    }

                    timer = $timeout(function () {
                        $scope.action(searchValue);
                    }, 700);
                };

                var setDefaultValue = function (defaultValue) {
                    if (defaultValue !== undefined && defaultValue !== '') {
                        openSearch();
                        $clearIcon.addClass('active');
                        $searchInput.val(defaultValue);
                    }
                };

                var setInputToMessageBegin = function () {
                    var input;

                    $searchInput[0].setSelectionRange(0, 0);
                    input = $searchInput[0].createTextRange(); // fix for IE searchinput
                    input.collapse(true);
                    input.select();
                };

                $searchIcon.click(openSearch);
                $searchPlaceholder.click(openSearch);

                $searchInput.on('focusout', function () {
                    if (eventIsOn) {
                        $searchInput.off('focusout', setInputToMessageBegin);
                        eventIsOn = false;
                    }
                    closeSearch();
                });

                $searchInput.on('input', function(e) {
                    search(e);
                    if (e.target.value) {
                        if (!eventIsOn && typeof $searchInput[0].createTextRange === 'function') {
                            $searchInput.on('focusout', setInputToMessageBegin);
                            eventIsOn = true;
                        }
                        $clearIcon.addClass('active');
                    } else {
                        $clearIcon.removeClass('active');
                    }
                });

                $clearIcon.click(function () {
                    $searchInput.val('');
                    search();
                    $clearIcon.removeClass('active');
                    $searchInput.focus();
                });

                setDefaultValue($scope.defaultValue);
                $scope.search = search;
            }
        };
    });
