'use strict';

angular.module('itest.portal.createnewtest.controllers')

    .controller('CreateNewTestCtrl', function($scope, categoryService, topicService, testService) {

        var loadCategories = function() {
            categoryService.getCategoriesForPublicTests().then(function(response) {
                var categories = response.list.map(function(category) {
                    return {
                        name: category.name,
                        value: category.id.toString()
                    };
                });

                $scope.categoryOptions.items = $scope.categoryOptions.items.concat(categories);
            });
        };

        var loadTopics = function() {
            topicService.getTopicsForPublicTests().then(function(response) {
                var topics = response.list.map(function(topic) {
                    return {
                        name: topic.name,
                        value: topic.id.toString()
                    };
                });

                $scope.topicOptions.items = $scope.topicOptions.items.concat(topics);
            });
        };

        var cleanEmptyItems = function() {
            var questions = [];
            $.each($scope.test.questions, function (firstIndex, currentQuestion) {
                var question = {
                    answers: []
                };
                $.each(currentQuestion.answers, function (secondIndex, answer) {
                    if (answer.answerText.trim() !== '') {
                        question.answers.push({
                            answerNumber: answer.answerNumber,
                            answerText: answer.answerText.trim(),
                            correct: answer.correct
                        });
                    }
                });
                if (currentQuestion.questionText.trim() !== '' || question.answers.length !== 0) {
                    if (question.answers.length === 0) {
                        question.answers.push({
                            answerNumber: 1,
                            answerText: '',
                            correct: true
                        });
                        question.answers.push({
                            answerNumber: 2,
                            answerText: '',
                            correct: false
                        });
                    }
                    question.questionNumber = currentQuestion.questionNumber;
                    question.questionText = currentQuestion.questionText.trim();
                    questions.push(question);
                }
            });
            if (questions.length === 0) {
                questions.push({
                    questionNumber: 1,
                    questionText: '',
                    answers: [
                        {
                            answerNumber: 1,
                            answerText: '',
                            correct: true
                        },
                        {
                            answerNumber: 2,
                            answerText: '',
                            correct: false
                        }
                    ]
                });
            }
            $scope.test.questions = questions;
        };

        var validateTest = function() {
            var numberCorrectAnswers;
            $scope.validationFailed = false;
            $.each($scope.test.questions, function (firstIndex, question) {
                if (question.questionText.trim() === '') {
                    $scope.validationFailed = true;
                }
                numberCorrectAnswers = 0;
                $.each(question.answers, function (secondIndex, answer) {
                    if (answer.answerText.trim() === '') {
                        $scope.validationFailed = true;
                    }
                    if (answer.correct) {
                        numberCorrectAnswers++;
                    }
                });
                if (numberCorrectAnswers === 0 || numberCorrectAnswers === question.answers.length) {
                    $scope.validationFailed = true;
                }
            });
            if ($scope.test.categoryId === 0 || $scope.test.topicId === 0) {
                $scope.validationFailed = true;
            }
        };

        $scope.questionsCountOptions = {
            title: 'Количество вопросов в тесте:',
            items: [
                {name: '1', value: 1, selected: true}
            ]
        };

        $scope.categoryOptions = {
            title: 'Категория:',
            items: [
                {name: 'Все категории', value: 0, selected: true}
            ]
        };

        $scope.topicOptions = {
            title: 'Тема:',
            items: [
                {name: 'Все темы', value: 0, selected: true}
            ]
        };

        $scope.test = {
            questions: [
                {
                    questionNumber: 1,
                    questionText: '',
                    answers: [
                        {
                            answerNumber: 1,
                            answerText: '',
                            correct: true
                        },
                        {
                            answerNumber: 2,
                            answerText: '',
                            correct: false
                        }
                    ]
                }
            ],
            questionsNumber: 1,
            categoryId: 0,
            topicId: 0,
            private: false,
            showCorrectAnswers: false
        };

        $scope.addAnswer = function(questionNumber) {
            $.each($scope.test.questions, function(index, question) {
                if (question.questionNumber === questionNumber) {
                    question.answers.push({
                        answerNumber: question.answers.length + 1,
                        answerText: '',
                        correct: false
                    });
                }
            });
        };

        $scope.addQuestion = function() {
            $scope.test.questions.push({
                questionNumber: $scope.test.questions.length + 1,
                questionText: '',
                answers: [
                    {
                        answerNumber: 1,
                        answerText: '',
                        correct: true
                    },
                    {
                        answerNumber: 2,
                        answerText: '',
                        correct: false
                    }
                ]
            });
            $scope.questionsCountOptions.items.push({
                name: ($scope.questionsCountOptions.items.length + 1).toString(),
                value: $scope.questionsCountOptions.items.length + 1,
                selected: false
            });
        };

        $scope.removeAnswer = function(questionNumber, answerNumber) {
            var answers = [];
            var index = 1;
            $.each($scope.test.questions, function(firstIndex, question){
                if (question.questionNumber === questionNumber) {
                    $.each(question.answers, function(secondIndex, answer) {
                        if (answer.answerNumber !== answerNumber) {
                            answers.push({
                                answerNumber: index,
                                answerText: answer.answerText,
                                correct: answer.correct
                            });
                            index++;
                        }
                    });
                    question.answers = answers;
                }
            });
        };

        $scope.removeQuestion = function(questionNumber) {
            var questions = [];
            var index = 1;
            $.each($scope.test.questions, function(firstIndex, question){
                if (question.questionNumber !== questionNumber) {
                    questions.push({
                        questionNumber: index,
                        questionText: question.questionText,
                        answers: question.answers
                    });
                    index++;
                }
            });

            $scope.test.questions = questions;

            if ($scope.questionsCountOptions.items[$scope.questionsCountOptions.items.length - 1].selected) {
                $scope.questionsCountOptions.items[$scope.questionsCountOptions.items.length - 2].selected = true;
            }
            $scope.questionsCountOptions.items.pop();
        };

        $scope.calculateCorrectAnswers = function(questionNumber) {
            var count = 0;
            $.each($scope.test.questions, function(firstIndex, question) {
                if (question.questionNumber === questionNumber) {
                    $.each(question.answers, function (secondIndex, answer) {
                        if (answer.correct) {
                            count++;
                        }
                    });
                }
            });
            return count;
        };

        $scope.createTest = function() {
            cleanEmptyItems();
            validateTest();
            if (!$scope.validationFailed) {
                testService.createTest($scope.test).then(function () {

                });
            }
        };

        $scope.convertNumberToLetter = function(number) {
            return String.fromCharCode(97 + number);
        };

        loadCategories();
        loadTopics();
    });
