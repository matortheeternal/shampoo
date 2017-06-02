export default function(ngapp) {
    ngapp.directive('resolveModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/resolveModal.html',
            controller: 'resolveModalController',
            scope: false
        }
    });

    ngapp.controller('resolveModalController', function ($scope, errorsService, xelibService, formUtils) {
        $scope.unfocusResolveModal = formUtils.unfocusModal($scope.toggleResolveModal);
        $scope.errorGroups = errorsService.errorGroups();

        $scope.setError = function() {
            if ($scope.errorIndex >= $scope.errorsToResolve.length) {
                $scope.toggleResolveModal();
                return;
            }
            $scope.error = $scope.errorsToResolve[$scope.errorIndex];
            $scope.group = $scope.errorGroups[$scope.error.group];
            $scope.resolutions = errorsService.getErrorResolutions($scope.error);
            $scope.selectedIndex = $scope.resolutions.indexOf($scope.error.resolution);
        };

        $scope.selectResolution = function(resolution) {
            $scope.error.resolution = resolution;
            $scope.nextError();
        };

        $scope.nextError = function() {
            $scope.errorIndex++;
            $scope.setError();
        };

        $scope.previousError = function() {
            $scope.errorIndex--;
            $scope.setError();
        };

        // initialize error
        $scope.errorIndex = 0;
        $scope.setError();
    });
}
