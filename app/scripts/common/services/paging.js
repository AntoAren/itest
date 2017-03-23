'use strict';

angular.module('itest.portal.common.services')

    .factory('PagingModel', function ($q) {

        var _offset;
        var _MAX = 31;
        var _sort;
        var _search;
        var _platform;
        var _visibilities;
        var _hasMore;
        var _loading;
        var _callToBackend;
        var _order;
        var _category;
        var _subscribed;

        var getOffset = function () {
            return _offset;
        };

        var setOffset = function (offset) {
            _offset = offset;
        };

        var getSort = function () {
            return _sort;
        };

        var resetParameters = function () {
            _offset = 0;
            _loading = false;
            _hasMore = true;
        };

        var setSort = function (sort) {
            _sort = sort;
            resetParameters();
        };

        var setOrder = function (order) {
            _order = order;
            resetParameters();
        };

        var setSearch = function (search) {
            _search = search;
            resetParameters();
        };

        var setPlatform = function (platform) {
            _platform = platform;
            resetParameters();
        };

        var setCategory = function (category) {
            _category = category;
            resetParameters();
        };

        var setVisibilities = function (visibilities) {
            _visibilities = visibilities;
            resetParameters();
        };

        var setSubscribed = function (subscribed) {
            _subscribed = subscribed;
            resetParameters();
        };

        var resetSort = function () {
            _order = '';
            _sort = '';
        };


        var hasMore = function () {
            return _hasMore;
        };

        var load = function (params) {
            if (hasMore() && !_loading) {
                _loading = true;
                var queryParams = $.extend({
                    offset: _offset,
                    max: _MAX,
                    sort: _sort,
                    search: _search,
                    platform: _platform,
                    category: _category,
                    visibilities: _visibilities,
                    order: _order,
                    subscribed: _subscribed
                }, params);
                return _callToBackend(queryParams).then(function (response) {
                    _offset += _MAX;
                    _hasMore = _offset < response.totalCount;
                    return response.list;
                }).finally(function () {
                    _loading = false;
                });
            } else {
                return $q.when([]);
            }
        };

        return function (callToBackend) {
            _callToBackend = callToBackend;
            resetSort();
            resetParameters();

            return {
                getOffset: getOffset,
                setOffset: setOffset,
                getSort: getSort,
                setSort: setSort,
                setOrder: setOrder,
                resetSort: resetSort,
                setSearch: setSearch,
                setPlatform: setPlatform,
                setCategory: setCategory,
                setVisibilities: setVisibilities,
                setSubscribed: setSubscribed,
                hasMore: hasMore,
                load: load,
                resetParameters: resetParameters
            };
        };
    });
