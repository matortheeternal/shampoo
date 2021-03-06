export default function(ngapp, xelib, remote, fileHelpers) {
    ngapp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('base.main', {
            templateUrl: 'partials/main.html',
            controller: 'mainController',
            url: '/main'
        });
    }]);

    ngapp.controller('mainController', function ($scope, $rootScope, $timeout, spinnerFactory, errorsService, xelibService) {
        $scope.loaded = false;
        $scope.log = xelib.GetMessages();
        $scope.checkedPlugins = 0;
        $scope.totalErrors = 0;
        $scope.plugins = [];
        $scope.spinnerOpts = spinnerFactory.defaultOptions;
        $scope.groupedErrors = errorsService.errorGroups();
        xelibService.printGlobals();

        $scope.groupErrors = function(plugin) {
            plugin.groupedErrors = errorsService.errorGroups();
            plugin.groupedErrors.forEach(function(errorGroup) {
                errorGroup.resolution = 'auto';
                errorGroup.showGroup = false;
                errorGroup.errors = plugin.errors.filter(function(error) {
                    return error.group === errorGroup.group;
                });
                $scope.changeErrorResolution(errorGroup);
            });
        };

        $scope.changeErrorResolution = function(errorGroup) {
            if (errorGroup.resolution === 'manual') {
                $scope.errorsToResolve = errorGroup.errors;
                $scope.toggleResolveModal(true);
            } else {
                errorsService.setGroupResolutions(errorGroup);
            }
        };

        $scope.toggleResolveModal = function(visible) {
            $scope.showResolveModal = visible;
        };

        $scope.toggleSettingsModal = function(visible) {
            $scope.showSettingsModal = visible;
        };

        $scope.toggleSaveModal = function(visible) {
            $scope.$applyAsync(function() {
                $scope.showSaveModal = visible;
            });
        };

        $scope.resolveError = function(group, error) {
            group.resolution = 'manual';
            $scope.errorsToResolve = [error];
            $scope.toggleResolveModal(true);
        };

        $scope.setPluginErrors = function(plugin, errors) {
            errorsService.getErrorMessages(errors);
            plugin.errors = errors;
            plugin.status = "Found " + errors.length + " errors";
            plugin.checking = false;
            plugin.checked = true;
            $scope.totalErrors += errors.length;
            $scope.groupErrors(plugin);
        };

        $scope.getErrors = function() {
            try {
                $scope.checkedPlugins++;
                var errors = xelib.GetErrors();
                console.log(errors);
                $scope.setPluginErrors($scope.currentPlugin, errors);
            } catch (e) {
                console.log(e);
                xelibService.getExceptionInformation();
            }
        };

        $scope.pollErrorChecking = function() {
            let done = xelib.GetErrorThreadDone();
            if (done) {
                $scope.getErrors();
                $scope.checkNextPlugin();
            } else {
                $timeout($scope.pollErrorChecking, 200);
            }
        };

        $scope.clearErrors = function(plugin) {
            if (!plugin.hasOwnProperty('errors')) return;
            $scope.totalErrors -= plugin.errors.length;
            delete plugin.errors;
            delete plugin.groupedErrors;
        };

        $scope.checkPluginForErrors = function(plugin) {
            plugin.status = "Checking for errors...";
            plugin.checking = true;
            $scope.clearErrors(plugin);
            try {
                xelib.CheckForErrors(plugin._id);
                $scope.currentPlugin = plugin;
                $scope.pollErrorChecking();
            } catch (e) {
                console.log(e);
                xelibService.logXELibMessages();
            }
        };

        $scope.endErrorCheck = function() {
            $scope.checkingDone = true;
            $scope.plugins.forEach(function(plugin) {
                if (!plugin.hasOwnProperty('groupedErrors')) return;
                $scope.groupedErrors.forEach(function(errorGroup, index) {
                    errorGroup.errors = errorGroup.errors.concat(plugin.groupedErrors[index].errors);
                });
            });
        };

        $scope.checkNextPlugin = function() {
            let nextPlugin = $scope.plugins.find(function(plugin) {
                return !plugin.skip && plugin.status === "Queued";
            });
            if (!nextPlugin) {
                $scope.endErrorCheck();
                return;
            }
            $scope.checkPluginForErrors(nextPlugin);
        };

        $scope.startCheck = function() {
            $scope.checkNextPlugin();
            $scope.pluginsToCheck = $scope.plugins.filter(function(plugin) {
                return !plugin.skip;
            }).length;
            $scope.checking = true;
        };

        $scope.ignorePlugin = function(filename) {
            let gameEsmFilename = $rootScope.selectedProfile.name + ".esm";
            return filename.endsWith(".dat") || (filename === gameEsmFilename);
        };

        $scope.getPlugins = function() {
            var pluginIds = xelib.GetElements(0);
            console.log(pluginIds);
            $scope.plugins = pluginIds.map(function (_id) {
                return {
                    _id: _id,
                    filename: xelib.Name(_id),
                    hash: xelib.MD5Hash(_id),
                    status: "Queued",
                    skip: false,
                    showContent: false
                };
            }).filter(function (plugin) {
                return !$scope.ignorePlugin(plugin.filename);
            });
        };

        $scope.buildErrors = function(plugin, errors) {
            return errors.map(function(error) {
                let _id = xelib.GetElement(plugin._id, xelibService.intToHex(error.f, 8));
                let x = {
                    handle: _id,
                    group: error.g,
                    form_id: error.f,
                    name: xelib.LongName(_id)
                };
                x.data = error.hasOwnProperty('d') ? error.d : '';
                x.path = error.hasOwnProperty('p') ? error.p : '';
                return x;
            });
        };

        $scope.loadCache = function() {
            $scope.plugins.forEach(function(plugin) {
                let filePath = `cache\\${plugin.filename}-${plugin.hash}.json`;
                if (fileHelpers.appDir.exists(filePath)) {
                    let cachedErrors = fileHelpers.loadJsonFile(filePath, {});
                    let errors = $scope.buildErrors(plugin, cachedErrors);
                    $scope.setPluginErrors(plugin, errors);
                    plugin.skip = true;
                    plugin.loadedCache = true;
                    plugin.status = `Found ${plugin.errors.length} cached errors`;
                }
            });
        };

        $scope.getLoadingMessage = function() {
            $scope.loadingMessage = $scope.log.split('\n').slice(-2)[0];
        };

        $scope.checkIfLoaded = function() {
            $scope.log = $scope.log + xelib.GetMessages();
            $scope.getLoadingMessage();
            if (xelib.GetLoaderDone()) {
                console.log($scope.log);
                $scope.loaded = true;
                $scope.getPlugins();
                $scope.loadCache();
            } else {
                $timeout($scope.checkIfLoaded, 250);
            }
        };

        // terminate xelib when application is done
        window.onbeforeunload = function(e) {
            if (remote.app.forceClose) return;
            $scope.toggleSaveModal(true);
            e.returnValue = false;
        };

        $scope.checkIfLoaded();
    });
}
