export default function(ngapp) {
    ngapp.directive('resolveModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/resolveModal.html',
            controller: 'resolveModalController',
            scope: false
        }
    });

    ngapp.controller('resolveModalController', function ($scope) {
        $scope.errorIndex = 0;
        $scope.setError();

        $scope.setError = function() {
            $scope.currentError = $scope.errorsToResolve[$scope.errorIndex];
        };

        $scope.nextError = function() {
            $scope.errorIndex++;
            $scope.setError();
        };

        $scope.previousError = function() {
            $scope.errorIndex--;
            $scope.setError();
        };
    });
}
