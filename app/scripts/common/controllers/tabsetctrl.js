'use strict';

angular.module('itest.portal.common.controllers')
    .controller('TabsetCtrl', function($scope, $state) {
        var that = this;
        var tabs = $scope.tabs = [];
        var destroyed;

        that.select = function(selectedTab) {
            angular.forEach(tabs, function(tab) {
                if (tab.active && tab !== selectedTab) {
                    tab.active = false;
                    tab.onDeselect();
                }
            });

            if (selectedTab) {
                selectedTab.active = true;
                selectedTab.onSelect();
            }
        };

        that.addTab = function(tab) {
            tabs.push(tab);
            if (tab.state) {
                if (tab.state === $state.current.name) {
                    tab.active = true;
                } else {
                    tab.active = false;
                }
            } else {
                if (tabs.length === 1 && tab.active !== false) {
                    tab.active = true;
                } else if (tab.active) {
                    that.select(tab);
                } else {
                    tab.active = false;
                }
            }
        };

        that.removeTab = function(tab) {
            var newActiveIndex;
            var index = tabs.indexOf(tab);

            if (tab.active && tabs.length > 1 && !destroyed) {
                newActiveIndex = (index === tabs.length - 1) ? index - 1 : index + 1;
                that.select(tabs[newActiveIndex]);
            }

            tabs.splice(index, 1);
        };

        that.getTabByHeading = function(tabHeading) {
            return _.find(tabs, {heading: tabHeading});
        };

        $scope.$on('$stateChangeSuccess', function (event, toState) {
            var tab;

            if (event.targetScope.previousStateName !== toState.name) {
                tab = _.find(tabs, {state: toState.name});
                if (tab) {
                    that.select(tab);
                }
            }
        });

        $scope.$on('$destroy', function() {
            destroyed = true;
        });
    });
