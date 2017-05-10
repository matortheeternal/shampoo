// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import env from './env';
import xelib from './xelib.js';
import 'angular-spinner';

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

var getExceptionInformation = function () {
  try {
      console.log(xelib.GetBuffer());
      console.log(xelib.GetExceptionMessage());
  } catch (e) {
      console.log("Failed to get exception information: " + e);
  }
};

var testGetGlobal = function () {
    try {
        console.log(xelib.GetGlobal('ProgramPath'));
    } catch (e) {
        console.log(e);
        getExceptionInformation();
    }
};

var logXELibBuffer = function () {
    console.log(xelib.GetBuffer());
};

var getAndFlushBuffer = function () {
    var log = xelib.GetBuffer();
    if (log) {
        xelib.FlushBuffer();
        return log + "\n";
    }
    return "";
};

var ngapp = angular.module('shampoo', [
    'ui.router', 'ct.ui.router.extras', 'angularSpinner'
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

    this.gamePathValid = function (gameMode, path) {
        var game = service.getGame(gameMode);
        return jetpack.exists(path + game.exeName);
    };
});

ngapp.controller('baseController', function ($scope) {
    // initialize xedit-lib
    xelib.Initialize();
    testGetGlobal();

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

ngapp.service('errorsFactory', function () {
    var factory = this;

    this.errorTypes = function () {
        return [
            {
                group: 1,
                name: "Identical to Master Records",
                acronym: "ITM",
                caption: "ITMs are dirty edits where a record has been overridden in a plugin file, but hasn't been changed.",
                benign: true,
                errors: []
            },
            {
                group: 2,
                name: "Identical to Previous Override Records",
                acronym: "ITPO",
                caption: "ITPOs are dirty edits where a record has been overridden in a plugin file, but hasn't been changed relative to the previous override.",
                benign: true,
                errors: []
            },
            {
                group: 3,
                name: "Deleted References",
                acronym: "UDR",
                caption: "UDRs are dirty edits where an object reference has been deleted instead of being disabled.",
                errors: []
            },
            {
                group: 4,
                name: "Unexpected Subrecords",
                acronym: "UES",
                caption: "UESs are errors where the data structure of a record is abnormal.",
                errors: []
            },
            {
                group: 5,
                name: "Unresolved References",
                acronym: "URR",
                caption: "URRs are errors where a record references another record that doesn't exist.",
                benign: true,
                errors: []
            },
            {
                group: 6,
                name: "Unexpected References",
                acronym: "UER",
                caption: "UERs are errors where a record references another record in an abnormal fashion.",
                benign: true,
                errors: []
            },
            {
                group: 0,
                name: "Other Errors",
                acronym: "OE",
                caption: "Errors that don't fall into the other groups are placed in this group.",
                benign: true,
                errors: []
            }
        ];
    };

    this.getErrorObject = function(elementId) {
        var errorString = xelib.GetErrorString(elementId);
        if (!errorString) return;
        var errorType = factory.errorTypes.find(function(errorType) {
            return errorType.expr && errorString.match(errorType.expr);
        }) || factory.errorTypes[0];
        return errorType.errorObject(elementId, errorString)
    };
});

ngapp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('base.main', {
        templateUrl: 'partials/main.html',
        controller: 'mainController',
        url: '/main'
    });
}]);

ngapp.controller('mainController', function ($scope, $rootScope, $timeout, errorsFactory) {
    $scope.loaded = false;
    $scope.log = getAndFlushBuffer();
    $scope.checkedPlugins = 0;
    $scope.totalErrors = 0;
    $scope.plugins = [];
    $scope.groupedErrors = errorsFactory.errorTypes();

    $scope.spinnerOpts = {
        lines: 17, // The number of lines to draw
        length: 0, // The length of each line
        width: 12, // The line thickness
        radius: 50, // The radius of the inner circle
        scale: 2, // Scales overall size of the spinner
        corners: 0, // Corner roundness (0..1)
        color: '#000', // #rgb or #rrggbb or array of colors
        opacity: 0.05, // Opacity of the lines
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        speed: 0.9, // Rounds per second
        trail: 70, // Afterglow percentage
        fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
        zIndex: 2, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        position: 'relative' // Element positioning
    };

    $scope.groupErrors = function(plugin) {
        plugin.errors.forEach(error => $scope.groupedErrors[error.group].errors.push(error));
    };

    $scope.setCurrentPluginErrors = function(errors) {
        $scope.currentPlugin.errors = errors;
        $scope.currentPlugin.status = "Found " + errors.length + " errors";
        $scope.currentPlugin.checked = true;
        $scope.checkedPlugins++;
        $scope.totalErrors += errors.length;
        $scope.groupErrors($scope.currentPlugin);
    };

    $scope.getErrors = function() {
        var errors = xelib.GetErrors();
        console.log(errors);
        $scope.setCurrentPluginErrors(errors);
    };

    $scope.pollErrorChecking = function() {
        var done = xelib.GetErrorThreadDone();
        if (done) {
            $scope.getErrors();
            $scope.checkNextPlugin();
        } else {
            $timeout($scope.pollErrorChecking, 200);
        }
    };

    $scope.checkPluginForErrors = function(plugin) {
        plugin.status = "Checking for errors...";
        try {
            xelib.CheckForErrors(plugin._id);
            $scope.currentPlugin = plugin;
            $scope.pollErrorChecking();
        } catch (e) {
            console.log(e);
            logXELibBuffer();
        }
    };

    $scope.checkNextPlugin = function () {
        var nextPlugin = $scope.plugins.find(function(plugin) {
            return !plugin.skip && plugin.status === "Queued";
        });
        if (!nextPlugin) {
            $scope.checkingDone = true;
            return;
        };
        $scope.checkPluginForErrors(nextPlugin);
    };

    $scope.startCheck = function() {
        $scope.checkNextPlugin();
        $scope.pluginsToCheck = $scope.plugins.filter(function(plugin) {
            return !plugin.skip;
        }).length;
        $scope.checking = true;
    };

    $scope.skipPlugin = function(filename) {
        var gameEsmFilename = $rootScope.selectedProfile.name + ".esm";
        return filename.endsWith(".dat") || filename === gameEsmFilename;
    };

    $scope.getPlugins = function () {
        var pluginIds = xelib.GetElements(0);
        console.log(pluginIds);
        $scope.plugins = pluginIds.map(function (_id) {
            return {
                _id: _id,
                filename: xelib.Name(_id),
                status: "Queued",
                skip: false
            }
        }).filter(function (plugin) {
            return !$scope.skipPlugin(plugin.filename);
        });
    };

    $scope.checkIfLoaded = function () {
        $scope.log = $scope.log + getAndFlushBuffer();
        if (xelib.GetLoaderDone()) {
            $scope.loaded = true;
            $scope.getPlugins();
        } else {
            $timeout($scope.checkIfLoaded, 500);
        }
    };

    $scope.checkIfLoaded();
});

ngapp.service('formUtils', function () {
    this.unfocusModal = function (callback) {
        return function (e) {
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

ngapp.directive('loadOrderModal', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/loadOrderModal.html',
        controller: 'loadOrderModalController',
        scope: false
    }
});

ngapp.controller('loadOrderModalController', function ($scope, $state, formUtils) {
    $scope.loadPlugins = function () {
        var loadOrder = $scope.loadOrder.filter(function (item) {
            return item.active;
        }).map(function (item) {
            return item.filename;
        });
        console.log(process.cwd());
        console.log("Loading: \n" + loadOrder);
        xelib.FlushBuffer();
        xelib.LoadPlugins(loadOrder.join('\n'));
        $state.go('base.main');
    };
});
