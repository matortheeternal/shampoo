export default function(ngapp) {
    ngapp.directive('resolveModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/resolveModal.html',
            controller: 'resolveModalController',
            scope: false
        }
    });

    ngapp.controller('resolveModalController', function ($scope, errorsService) {
        $scope.errorIndex = 0;
        $scope.setError();

        $scope.setError = function() {
            $scope.error = $scope.errorsToResolve[$scope.errorIndex];
            $scope.resolutions = errorsService.getErrorResolutions($scope.error);
        };

        $scope.selectResolution = function(resolution) {
            $scope.error.selectedResolution = resolution;
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
