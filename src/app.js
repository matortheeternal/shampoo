// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import env from './env';
import xelib from './xeditLib.js';

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

// helper function for loading json file
var loadJsonFile = function (filename, defaultValue) {
    if (appDir.exists(filename) === 'file') {
        return appDir.read(filename, 'json');
    } else {
        return defaultValue || [];
    }
};

var ngapp = angular.module('shampoo', [
    'ui.router', 'ct.ui.router.extras'
]);

ngapp.config(function ($urlMatcherFactoryProvider) {
    //this allows urls with and without trailing slashes to go to the same state
    $urlMatcherFactoryProvider.strictMode(false);
});

ngapp.run(['$rootScope', '$state', function ($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (evt, toState, params, fromState) {
        if (toState.redirectTo) {
            evt.preventDefault();
            $state.go(toState.redirectTo, params, {location: 'replace'});
        }
    });
}]);

// TODO: GET PROPER BUNDLING INSTEAD
ngapp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('base', {
        url: '',
        redirectTo: 'base.start',
        templateUrl: 'partials/base.html',
        controller: 'baseController'
    });
}]);

ngapp.service('profileService', function () {
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

    this.gamePathValid = function(gameMode, path) {
        var game = service.getGame(gameMode);
        return jetpack.exists(path + game.exeName);
    };
});

ngapp.controller('baseController', function ($scope) {
    // initialize xedit-lib
    xelib.Initialize();

    $scope.helpClick = function () {
        //$scope.toggleHelpModal();
    };

    $scope.minimizeClick = function () {
        var window = remote.getCurrentWindow();
        window.minimize();
    };

    $scope.restoreClick = function () {
        var window = remote.getCurrentWindow();
        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    };

    $scope.closeClick = function () {
        var window = remote.getCurrentWindow();
        window.close();
    };
});

ngapp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('base.start', {
        templateUrl: 'partials/start.html',
        controller: 'startController',
        url: '/start'
    });
}]);

ngapp.controller('startController', function ($scope, profileService) {
    $scope.profiles = profileService.getProfiles();
    $scope.selectedProfile = ($scope.profiles.length > 0) && $scope.profiles[0];

    $scope.setSelectedGame = function () {
        if ($scope.selectedProfile) {
            $scope.selectedGame = profileService.getGame($scope.selectedProfile.gameMode);
        } else {
            $scope.selectedGame = {};
        }
    };

    $scope.toggleProfilesModal = function(visible) {
        $scope.showProfilesModal = visible;
        $scope.$emit('toggleModal', visible);
    };

    // load selectedGame
    $scope.setSelectedGame();
});

ngapp.service('formUtils', function() {
    this.unfocusModal = function(callback) {
        return function(e) {
            if (e.target.classList.contains("modal-container")) {
                callback(false);
            }
        }
    };
});

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

    $scope.games.forEach(function(game) {
        var gameProfile = $scope.profiles.find(function(profile) {
            return profile.gameMode == game.mode;
        });
        game.installPath = gameProfile ? gameProfile.installPath : '';
    });

    $scope.unfocusProfilesModal = formUtils.unfocusModal($scope.toggleProfilesModal);

    $scope.buildValidProfiles = function() {
        $scope.validProfiles = $scope.games.filter(function(game) {
            game.valid = profileService.gamePathValid(game.mode, game.installPath);
            return game.valid;
        });
        if (!$scope.defaultProfile && $scope.validProfiles.length) {
            $scope.defaultProfile = $scope.validProfiles[0];
        }
    };

    $scope.pathBrowse = function(game) {
        // todo
    };

    $scope.saveProfiles = function() {
        // todo
    };

    $scope.buildValidProfiles();
});
