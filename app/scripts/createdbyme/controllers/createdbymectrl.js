'use strict';

angular.module('itest.portal.createdbyme.controllers')

    .controller('CreatedByMeCtrl', function($scope, $location, testService, PagingModel,
                                        $stateParams, categoryService, topicService, $state, previousStateService) {
        var paging = new PagingModel(testService.getTestsCreatedByMe);
        var CATEGORY_PARAM = 'category';
        var TOPIC_PARAM = 'topic';
        var SEARCH_PARAM = 'search';
        var SORT_PARAM = 'sort';

        var filters = {
            category: $stateParams[CATEGORY_PARAM] || '',
            topic: $stateParams[TOPIC_PARAM] || '',
            sort: $stateParams[SORT_PARAM] || 'name',
            search: $stateParams[SEARCH_PARAM] || ''
        };

        var checkFiltersAndSearch = function() {
            $scope.searchResult = filters.category + filters.topic + filters.search !== '';
            $scope.isResetUnavailable = !$scope.searchResult && filters.sort === 'name';
        };

        var loadPortion = function() {
            $scope.loadingTests = true;
            paging.load(filters).then(function(response) {
                $scope.tests = $scope.tests.concat(response);
                $scope.hasMore = paging.hasMore();
                $scope.firstTime = false;
            }).finally(function() {
                checkFiltersAndSearch();
                $scope.loadingTests = false;
            });
        };

        var loadTests = function() {
            var sortParameter = filters.sort;

            $scope.tests = [];
            paging.setSort(sortParameter);

            if (sortParameter === 'creationDate') {
                paging.setOrder('DESC');
            } else {
                paging.setOrder('ASC');
            }

            loadPortion();
        };

        var setSelectedOption = function(options, selectedOption) {
            if (selectedOption !== undefined) {
                $.each(options, function(index, item) {
                    item.value = item.value.toString();
                    item.selected = (item.value.toLowerCase() === selectedOption.toLowerCase());
                });
            }
        };

        var loadCategories = function() {
            categoryService.getCategoriesForPublicTests().then(function(response) {
                var categories = response.list.map(function(category) {
                    return {
                        name: category.name,
                        value: category.id.toString()
                    };
                });

                $scope.categoryOptions.items = $scope.categoryOptions.items.concat(categories);
                setSelectedOption($scope.categoryOptions.items, filters.category);
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
                setSelectedOption($scope.topicOptions.items, filters.topic);
            });
        };

        $scope.uploadAction = {
            name: 'Добавить тест',
            icon: 'upload-widget-icon'
        };

        $scope.categoryOptions = {
            title: 'Категория:',
            items: [
                {name: 'Все категории', value: '', selected: true}
            ]
        };

        $scope.topicOptions = {
            title: 'Тема:',
            items: [
                {name: 'Все темы', value: '', selected: true}
            ]
        };

        $scope.sortOptions = {
            title: 'Сортировать по:',
            items: [
                {name: 'Дата создания', value: 'creationDate'},
                {name: 'Название', value: 'name', selected: true}
            ]
        };

        $scope.isResetUnavailable = true;
        $scope.loadingTests = true;
        $scope.$location = $location;
        $scope.tests = [];
        $scope.categories = [];
        $scope.topics = [];
        $scope.hasMore = true;
        $scope.firstTime = true;
        $scope.loadMore = loadPortion;
        $scope.searchValue = filters.search;

        $scope.filterTestsByCategory = function(category) {
            if (filters.category !== category) {
                $scope.hasMore = true;
                filters.category = category;
                $location.search(CATEGORY_PARAM, filters.category);
                loadTests();
            }
        };

        $scope.filterTestsByTopic = function(topic) {
            if (filters.topic !== topic) {
                $scope.hasMore = true;
                filters.topic = topic;
                $location.search(TOPIC_PARAM, filters.topic);
                loadTests();
            }
        };

        $scope.searchTests = function (searchValue) {
            if (filters.search !== searchValue) {
                $scope.hasMore = true;
                filters.search = searchValue;
                $location.search(SEARCH_PARAM, searchValue);
                loadTests();
            }
        };

        $scope.sortTests = function(sorting) {
            if (filters.sort !== sorting) {
                $scope.hasMore = true;
                filters.sort = sorting;
                $location.search(SORT_PARAM, filters.sort);
                loadTests();
            }
        };

        $scope.resetFilters = function () {
            $scope.hasMore = true;
            filters.category = '';
            filters.topic = '';
            filters.search = '';
            filters.sort = 'name';
            $location.search({});
            setSelectedOption($scope.categoryOptions.items, filters.category);
            setSelectedOption($scope.topicOptions.items, filters.topic);
            setSelectedOption($scope.sortOptions.items, filters.sort);
            loadTests();
        };

        previousStateService.pushPreviousState($state.$current.name);

        loadTests();
        loadCategories();
        loadTopics();
        setSelectedOption($scope.sortOptions.items, filters.sort);
    });
