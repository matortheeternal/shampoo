export default function(ngapp) {
    ngapp.directive('profilesModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/profilesModal.html',
            controller: 'profilesModalController',
            scope: false
        }
    });

    ngapp.controller('profilesModalController', function ($scope, profileService, formUtils) {
        $scope.games = profileService.games;

        $scope.games.forEach(function(game) {
            var gameProfile = $scope.profiles.find(function(profile) {
                return profile.gameMode == game.mode;
            });
            if (gameProfile) game.installPath = gameProfile.installPath;
        });

        $scope.unfocusProfilesModal = formUtils.unfocusModal($scope.toggleProfilesModal);

        $scope.validateProfiles = function() {
            $scope.games.forEach(function(game) {
                game.valid = profileService.gamePathValid(game.mode, game.installPath);
            });
            $scope.validProfiles = profileService.getProfiles();
            $scope.defaultProfile = $scope.validProfiles[0];
        };

        $scope.setProfileGamePaths = function() {
            profileService.profiles.forEach(function(profile) {
                let game = $scope.games.find(function(game) {
                    return game.mode === profile.gameMode;
                });
                profile.installPath = game.installPath;
            });
        };

        $scope.close = function() {
            $scope.setProfileGamePaths();
            profileService.setDefaultProfile($scope.defaultProfile);
            $scope.toggleProfilesModal();
        };

        $scope.pathBrowse = function(game) {
            // todo
        };

        $scope.validateProfiles();
    });
}
