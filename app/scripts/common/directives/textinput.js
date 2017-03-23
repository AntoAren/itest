'use strict';

angular.module('itest.portal.common.directives')

    .directive('textInput', function($timeout, $rootScope) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'views/common/textinput.html',
            scope: {
                id: '@',
                type: '@',
                isRequired: '=',
                tabindex: '@',
                placeholder: '@',
                ngModel: '=',
                inputType: '@',
                maxLength: '=',
                errorHandler: '=',
                setFocusOnInputError: '=',
                disabled: '='
            },
            link: function($scope, $element) {
                var $container = $element.find('.text-input-container');
                var eventIsOn = false;
                var $inputField, $hiddenDiv, content;

                var setInputToMessageBegin = function () {
                    var input;

                    $inputField[0].setSelectionRange(0, 0);
                    input = $inputField[0].createTextRange(); // fix for IE searchinput
                    input.collapse(true);
                    input.select();
                };

                var initEvents = function () {
                    if ($scope.inputType === 'input') {
                        $inputField = $container.find('input');
                    } else {
                        $hiddenDiv = $(document.createElement('div'));
                        content = null;

                        $inputField = $container.find('textarea');
                        $hiddenDiv.addClass('hiddendiv');

                        $hiddenDiv.text($inputField.text())
                            .width('100%')
                            .css('font-family', $inputField.css('font-family'))
                            .css('font-size', $inputField.css('font-size'))
                            .css('line-height', $inputField.css('line-height'));

                        $container.append($hiddenDiv);

                        $inputField.on({
                            input: function(){
                                content = $(this).val();
                                content = content.replace(/\n/g, '<br>');
                                $hiddenDiv.html(content + '<br class="lbr">');

                                $(this).css('min-height', $hiddenDiv.height());
                            }
                        });

                        $(window).bind('resize', function() {
                            var text = $hiddenDiv[0].textContent;

                            $inputField.css('min-height', text.length ? $hiddenDiv.height() : 0);
                        });
                    }

                    if ($scope.isRequired) {
                        $inputField.attr('required', true);
                    }

                    $inputField.each(function() {
                        if ($(this).val() !== '') {
                            $(this).parent().addClass('animation');
                        }
                    });

                    $inputField.focus(function(){
                        $(this).parent().addClass('animation animation-color');
                    });

                    $inputField.on('input', function(){
                        if (!eventIsOn && typeof $inputField[0].createTextRange === 'function') {
                            $inputField.on('focusout', setInputToMessageBegin);
                            eventIsOn = true;
                        }
                    });

                    $inputField.focusout(function(){
                        var $this = $(this);

                        $scope.inputErrors = false;

                        if (eventIsOn) {
                            $inputField.off('focusout', setInputToMessageBegin);
                            eventIsOn = false;
                        }

                        $this.val($this.val().trim());

                        if ($scope.inputType === 'textarea') {
                            content = $this.val();
                            content = content.replace(/\n/g, '<br>');
                            $hiddenDiv.html(content + '<br class="lbr">');

                            $this.css('min-height', $hiddenDiv.height());
                        }

                        if ($this.val() === '') {
                            $this.parent().removeClass('animation');
                        } else {
                            if ($scope.errorHandler) {
                                $scope.errorHandler = false;
                                $scope.$apply();
                            }
                        }
                        $this.parent().removeClass('animation-color');
                    });
                };

                if ($scope.setFocusOnInputError) {
                    $rootScope.$on('notifier:newNotification', function() {
                        $scope.$watch('errorHandler', function(value) {
                            if (value) {
                                $inputField.focus();
                            }
                        });
                    });
                }

                $timeout(initEvents);
            }
        };
    });
