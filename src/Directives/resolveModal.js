export default function(ngapp) {
    ngapp.directive('resolveModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/resolveModal.html',
            controller: 'resolveModalController',
            scope: false
        }
    });

    ngapp.controller('resolveModalController', function ($scope, $element, errorsService, xelibService, formUtils) {
        $scope.unfocusResolveModal = formUtils.unfocusModal($scope.toggleResolveModal);
        $scope.errorGroups = errorsService.errorGroups();

        $scope.getAllowedKeys = function() {
            $scope.allowedKeys = [];
            for (var i = 1; i <= $scope.resolutions.length; i++) {
                $scope.allowedKeys.push(48 + i, 96 + i);
            }
        };

        $scope.prepareView = function() {
            $scope.element = xelibService.getRecordView($scope.error.handle);
            if ($scope.error.path) {
                xelibService.highlightField($scope.element, $scope.error.path)
            }
        };

        $scope.prepareResolutions = function() {
            $scope.resolutions = errorsService.getErrorResolutions($scope.error);
            $scope.selectedIndex = $scope.resolutions.indexOf($scope.error.resolution);
            $scope.getAllowedKeys();
        };

        $scope.setError = function() {
            if ($scope.errorIndex + 1 >= $scope.errorsToResolve.length) {
                $scope.toggleResolveModal();
                return;
            }
            $scope.error = $scope.errorsToResolve[$scope.errorIndex];
            $scope.group = $scope.errorGroups[$scope.error.group];
            $scope.prepareView();
            $scope.prepareResolutions();
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

        $scope.onKeyPress = function(e) {
            var n = $scope.allowedKeys.indexOf(e.keyCode);
            if (n > -1) {
                $scope.selectResolution($scope.resolutions[Math.floor(n / 2)]);
            }
            // next error on w or right arrow key
            else if (e.keyCode == 87 || e.keyCode == 39) {
                $scope.nextError();
            }
            // previous error on q or left arrow key
            else if (e.keyCode == 81 || e.keyCode == 37) {
                $scope.previousError();
            }
            // close on escape
            else if (e.keyCode == 27) {
                $scope.toggleResolveModal();
            }
        };

        // initialize error
        $scope.errorIndex = 0;
        $scope.setError();

        // focus modal
        var modalElement = $element[0].firstElementChild.firstElementChild;
        modalElement.focus();
    });
}
