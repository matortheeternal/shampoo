export default function(ngapp) {
    ngapp.directive('settingsModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/settingsModal.html',
            controller: 'settingsModalController',
            scope: false
        }
    });

    ngapp.controller('settingsModalController', function ($scope, formUtils, settingsService) {
        $scope.settings = settingsService.settings;
        $scope.profileName = settingsService.currentProfile;

        $scope.saveSettings = function() {
            settingsService.saveSettings($scope.settings);
            $scope.toggleSettingsModal();
        };

        $scope.unfocusSettingsModal = formUtils.unfocusModal($scope.saveSettings);
    });
}
