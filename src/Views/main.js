export default function(ngapp, xelib, remote) {
    ngapp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('base.main', {
            templateUrl: 'partials/main.html',
            controller: 'mainController',
            url: '/main'
        });
    }]);

    ngapp.controller('mainController', function ($scope, $rootScope, $timeout, errorsService, xelibService) {
        $scope.loaded = false;
        $scope.log = xelib.GetMessages();
        $scope.checkedPlugins = 0;
        $scope.totalErrors = 0;
        $scope.plugins = [];
        $scope.groupedErrors = errorsService.errorGroups();
        xelibService.printGlobals();

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
            plugin.groupedErrors = errorsService.errorGroups();
            plugin.groupedErrors.forEach(function(errorGroup) {
                errorGroup.resolution = 'auto';
                errorGroup.showGroup = false;
                errorGroup.errors = plugin.errors.filter(function(error) {
                    return error.group === errorGroup.group;
                });
                $scope.changeErrorResolution(errorGroup);
            });

            $scope.groupedErrors.forEach(function(errorGroup, index) {
                errorGroup.errors = errorGroup.errors.concat(plugin.groupedErrors[index].errors);
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

        $scope.setCurrentPluginErrors = function(errors) {
            errorsService.getErrorMessages(errors);
            $scope.currentPlugin.errors = errors;
            $scope.currentPlugin.status = "Found " + errors.length + " errors";
            $scope.currentPlugin.checked = true;
            $scope.checkedPlugins++;
            $scope.totalErrors += errors.length;
            $scope.groupErrors($scope.currentPlugin);
        };

        $scope.getErrors = function() {
            try {
                var errors = xelib.GetErrors();
                console.log(errors);
                $scope.setCurrentPluginErrors(errors);
            } catch (e) {
                xelibService.getExceptionInformation();
            }
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
                xelibService.logXELibMessages();
            }
        };

        $scope.checkNextPlugin = function () {
            var nextPlugin = $scope.plugins.find(function(plugin) {
                return !plugin.skip && plugin.status === "Queued";
            });
            if (!nextPlugin) {
                $scope.checkingDone = true;
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

        $scope.skipPlugin = function(filename) {
            var gameEsmFilename = $rootScope.selectedProfile.name + ".esm";
            return filename.endsWith(".dat") || (filename === gameEsmFilename);
        };

        $scope.getPlugins = function() {
            var pluginIds = xelib.GetElements(0);
            console.log(pluginIds);
            $scope.plugins = pluginIds.map(function (_id) {
                return {
                    _id: _id,
                    filename: xelib.Name(_id),
                    status: "Queued",
                    skip: false,
                    showContent: false
                };
            }).filter(function (plugin) {
                return !$scope.skipPlugin(plugin.filename);
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
