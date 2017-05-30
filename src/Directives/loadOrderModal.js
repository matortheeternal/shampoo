export default function(ngapp, xelib) {
    ngapp.directive('loadOrderModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/loadOrderModal.html',
            controller: 'loadOrderModalController',
            scope: false
        }
    });

    ngapp.controller('loadOrderModalController', function ($scope, $state) {
        $scope.loadPlugins = function () {
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
    });
}
