export default function(ngapp, fileHelpers) {
    ngapp.directive('profilesModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/profilesModal.html',
            controller: 'profilesModalController',
            scope: false
        }
    });

    ngapp.controller('profilesModalController', function ($scope, profileService, formUtils) {
        // initialize scope variables
        $scope.games = profileService.games;
        $scope.languages = profileService.languages;
        $scope.defaultProfile = profileService.getDefaultProfile();

        // scope functions
        $scope.addProfile = function() {
            $scope.profiles.push({
                name: profileService.newProfileName('New Profile'),
                gameMode: 3,
                gamePath: '',
                language: 'English',
                valid: false
            });
        };

        $scope.removeProfile = function(profile) {
            let index = $scope.profiles.indexOf(profile);
            $scope.profiles.splice(index, 1);
        };

        $scope.validateProfile = function(profile) {
            profileService.validateProfile(profile);
        };

        $scope.close = function() {
            profileService.setDefaultProfile($scope.defaultProfile);
            profileService.saveProfiles();
            $scope.toggleProfilesModal();
        };

        $scope.browse = function(profile) {
            let game = profileService.getGame(profile.gameMode);
            profile.gamePath = fileHelpers.selectDirectory(`Select your ${game.name} directory`, profile.gamePath) + '\\';
        };

        // inherited functions
        $scope.unfocusProfilesModal = formUtils.unfocusModal($scope.close);
    });
}
