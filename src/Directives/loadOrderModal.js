export default function(ngapp, xelib) {
    ngapp.directive('loadOrderModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/loadOrderModal.html',
            controller: 'loadOrderModalController',
            scope: false
        }
    });

    ngapp.controller('loadOrderModalController', function ($scope, $state, $element) {
        $scope.prevIndex = undefined;

        $scope.updateIndexes = function() {
            var n = 0;
            $scope.loadOrder.forEach(function(item) {
                if (item.active) item.index = n++;
            });
        };

        $scope.clearSelection = function() {
            $scope.loadOrder.forEach(function(item) {
                item.selected = false;
            });
            $scope.prevIndex = undefined;
        };

        $scope.select = function(e, item, index) {
            if (e.shiftKey && $scope.prevIndex !== undefined) {
                var start = Math.min(index, $scope.prevIndex);
                var end = Math.max(index, $scope.prevIndex);
                for (var i = start; i <= end; i++) {
                    $scope.loadOrder[i].selected = true;
                }
            } else if (e.ctrlKey) {
                item.selected = !item.selected;
            } else {
                $scope.clearSelection();
                item.selected = true;
            }
            $scope.prevIndex = index;
            e.stopPropagation();
        };

        $scope.onKeyPress = function(e) {
            // toggle selected items if space pressed
            if (e.keyCode == 32) {
                $scope.loadOrder.forEach(function(item) {
                    if (item.selected) item.active = !item.active;
                });
                $scope.updateIndexes();
            }
            // clear selection on escape
            else if (e.keyCode == 27) {
                $scope.clearSelection();
            }
            // load plugins on enter
            else if (e.keyCode == 13) {
                $scope.loadPlugins();
            }
        };

        $scope.loadPlugins = function() {
            var loadOrder = $scope.loadOrder.filter(function (item) {
                return item.active;
            }).map(function (item) {
                return item.filename;
            });
            console.log("Loading: \n" + loadOrder);
            xelib.ClearMessages();
            xelib.LoadPlugins(loadOrder.join('\n'));
            $state.go('base.main');
        };

        // initialize view model properties
        $scope.updateIndexes();
        $scope.clearSelection();

        // focus modal
        var modalElement = $element[0].firstElementChild.firstElementChild;
        modalElement.focus();
    });
}
