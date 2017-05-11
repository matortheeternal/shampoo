export default function(ngapp, xelib) {
    ngapp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('base.start', {
            templateUrl: 'partials/start.html',
            controller: 'startController',
            url: '/start'
        });
    }]);

    ngapp.controller('startController', function ($scope, $rootScope, profileService) {
        $scope.profiles = profileService.getProfiles();
        $scope.selectedProfile = ($scope.profiles.length > 0) && $scope.profiles[0];

        $scope.setSelectedGame = function () {
            if ($scope.selectedProfile) {
                $scope.selectedGame = profileService.getGame($scope.selectedProfile.gameMode);
            } else {
                $scope.selectedGame = {};
            }
        };

        $scope.toggleProfilesModal = function (visible) {
            $scope.showProfilesModal = visible;
            $scope.$emit('toggleModal', visible);
        };

        $scope.toggleLoadOrderModal = function (visible) {
            $scope.showLoadOrderModal = visible;
            $scope.$emit('toggleModal', visible);
        };

        $scope.getLoadOrder = function () {
            var loadOrder = xelib.GetLoadOrder().split('\n');
            console.log(loadOrder);
            $scope.loadOrder = loadOrder.map(function (filename) {
                return {
                    filename: filename,
                    active: false
                }
            });
        };

        $scope.startSession = function () {
            console.log("Setting game mode to: " + $scope.selectedProfile.gameMode);
            $rootScope.selectedProfile = $scope.selectedProfile;
            xelib.SetGameMode($scope.selectedProfile.gameMode);
            $scope.getLoadOrder();
            $scope.toggleLoadOrderModal(true);
        };

        // load selectedGame
        $scope.setSelectedGame();
    });
}
