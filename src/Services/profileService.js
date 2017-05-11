export default function(ngapp, xelib, electron) {
    var jetpack = electron.jetpack;
    var app = electron.remote.app;
    var appDir = jetpack.cwd(app.getAppPath());

    // helper function for loading json file
    var loadJsonFile = function (filename, defaultValue) {
        if (appDir.exists(filename) === 'file') {
            return appDir.read(filename, 'json');
        } else {
            return defaultValue || [];
        }
    };

    ngapp.service('profileService', function() {
        var service = this;

        this.games = loadJsonFile('app/games.json');
        this.profiles = loadJsonFile('app/profiles.json');

        this.saveProfiles = function (profiles) {
            appDir.write('app/profiles.json', JSON.stringify(profiles));
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
            return jetpack.exists(path + game.exeName);
        };
    });
}
