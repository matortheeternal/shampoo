export default function(ngapp, xelib) {
    ngapp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('base.main', {
            templateUrl: 'partials/main.html',
            controller: 'mainController',
            url: '/main'
        });
    }]);

    ngapp.controller('mainController', function ($scope, $rootScope, $timeout, errorsFactory, xelibService) {
        $scope.loaded = false;
        $scope.log = xelibService.getAndFlushBuffer();
        $scope.checkedPlugins = 0;
        $scope.totalErrors = 0;
        $scope.plugins = [];
        $scope.groupedErrors = errorsFactory.errorTypes();

        $scope.groupErrors = function(plugin) {
            plugin.errors.forEach(function(error) {
                var group = $scope.groupedErrors.slice(error.group - 1)[0];
                group.errors.push(error);
            });
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
                xelibService.logXELibBuffer();
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
            $scope.log = $scope.log + xelibService.getAndFlushBuffer();
            if (xelib.GetLoaderDone()) {
                $scope.loaded = true;
                $scope.getPlugins();
            } else {
                $timeout($scope.checkIfLoaded, 500);
            }
        };

        $scope.checkIfLoaded();
    });
}
