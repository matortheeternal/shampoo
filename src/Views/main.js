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
        $scope.log = xelib.GetMessages();
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

        $scope.getPlugins = function () {
            var pluginIds = xelib.GetElements(0);
            console.log(pluginIds);
            $scope.plugins = pluginIds.map(function (_id) {
                return {
                    _id: _id,
                    filename: xelib.Name(_id),
                    status: "Queued",
                    skip: false
                };
            }).filter(function (plugin) {
                return !$scope.skipPlugin(plugin.filename);
            });
        };

        $scope.checkIfLoaded = function () {
            $scope.log = $scope.log + xelib.GetMessages();
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
