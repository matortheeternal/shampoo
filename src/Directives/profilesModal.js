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
        $scope.games = angular.copy(profileService.games);
        $scope.validProfiles = [];

        $scope.games.forEach(function (game) {
            var gameProfile = $scope.profiles.find(function (profile) {
                return profile.gameMode == game.mode;
            });
            game.installPath = gameProfile ? gameProfile.installPath : '';
        });

        $scope.unfocusProfilesModal = formUtils.unfocusModal($scope.toggleProfilesModal);

        $scope.buildValidProfiles = function () {
            $scope.validProfiles = $scope.games.filter(function (game) {
                game.valid = profileService.gamePathValid(game.mode, game.installPath);
                return game.valid;
            });
            if (!$scope.defaultProfile && $scope.validProfiles.length) {
                $scope.defaultProfile = $scope.validProfiles[0];
            }
        };

        $scope.pathBrowse = function (game) {
            // todo
        };

        $scope.saveProfiles = function () {
            // todo
        };

        $scope.buildValidProfiles();
    });
}
