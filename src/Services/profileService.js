export default function(ngapp, xelib, fileHelpers) {
    ngapp.service('profileService', function() {
        var service = this;

        this.games = fileHelpers.loadJsonFile('app/games.json');
        this.profiles = fileHelpers.loadJsonFile('app/profiles.json');

        this.saveProfiles = function (profiles) {
            fileHelpers.saveJsonFile('app/profiles.json', profiles);
        };

        this.createProfile = function (game) {
            var installPath = xelib.GetGamePath(game.mode);
            if (installPath) {
                return {
                    name: game.name,
                    gameMode: game.mode,
                    installPath: installPath
                }
            }
        };

        this.detectMissingProfiles = function (profiles) {
            service.games.forEach(function (game) {
                var gameProfile = profiles.find(function (profile) {
                    return profile.gameMode == game.mode;
                });
                if (!gameProfile) {
                    gameProfile = service.createProfile(game);
                    if (gameProfile) profiles.push(gameProfile);
                }
            });
        };

        this.getProfiles = function () {
            service.detectMissingProfiles(service.profiles);
            service.saveProfiles(service.profiles);
            return service.profiles;
        };

        this.getGame = function (gameMode) {
            return service.games.find(function (game) {
                return game.mode == gameMode;
            });
        };

        this.gamePathValid = function (gameMode, path) {
            var game = service.getGame(gameMode);
            return fileHelpers.jetpack.exists(path + game.exeName);
        };
    });
}
