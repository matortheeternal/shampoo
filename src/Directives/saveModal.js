export default function(ngapp, xelib, fileHelpers) {
    ngapp.directive('saveModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/saveModal.html',
            controller: 'saveModalController',
            scope: false
        }
    });

    ngapp.controller('saveModalController', function($scope, $timeout, listViewFactory) {
        // initialize scope variables
        $scope.saving = false;
        $scope.message = 'Saving data';
        $scope.detailedMessage = '';
        $scope.pluginsToProcess = $scope.plugins.filter(function(plugin) {
            return plugin.hasOwnProperty('errors');
        });
        $scope.total = $scope.pluginsToSave.length;

        // build shared functions
        listViewFactory.build($scope, 'pluginsToProcess', 'save');

        // helper functions
        var alertException = function(callback) {
            try {
                callback();
            } catch (x) {
                alert(x);
            }
        };

        var buildCache = function() {
            var cache = [];
            $scope.pluginsToProcess.forEach(function(plugin, index) {
                $scope.detailedMessage = `${plugin.filename} (${index}/${$scope.total})`;
                cache.push({
                    filename: plugin.filename,
                    hash: plugin.hash,
                    errors: plugin.errors
                });
            });
            return cache;
        };

        var sanitizeErrors = function(errors) {
            return errors.map(function(error) {
                let x = {
                    g: error.group,
                    f: error.form_id
                };
                if (error.hasOwnProperty('data')) {
                    x.d = error.data;
                }
                return x;
            });
        };

        // scope functions
        $scope.save = function() {
            $scope.saving = true;
            $scope.pluginsToSave = $scope.pluginsToProcess.filter(function(plugin) {
                return plugin.active;
            });
            $timeout(function() {
                if ($scope.pluginsToSave.length > 0) {
                    $scope.applyErrorResolutions();
                    $scope.savePlugins();
                    $scope.saveCache();
                }
                $scope.finalize();
            }, 50);
        };

        $scope.applyErrorResolutions = function() {
            $scope.$applyAsync(function() {
                $scope.message = 'Applying error resolutions';
            });
            $scope.pluginsToSave.forEach(function(plugin, index) {
                $scope.detailedMessage = `${plugin.filename} (${index}/${$scope.total})`;
                plugin.errors.forEach(function(error) {
                    if (error.resolution && error.resolution.hasOwnProperty('execute')) {
                        if (!plugin.errorsResolved) plugin.errorsResolved = true;
                        alertException(function() {
                            error.resolution.execute(error);
                        });
                    }
                });
            });
        };

        $scope.savePlugins = function() {
            $scope.$applyAsync(function() {
                $scope.message = 'Saving plugins';
            });
            $scope.pluginsToSave.forEach(function(plugin, index) {
                $scope.detailedMessage = `${plugin.filename} (${index}/${$scope.total})`;
                if (!plugin.errorsResolved) return;
                alertException(function() {
                    xelib.SaveFile(plugin._id);
                });
            });
        };

        $scope.saveCache = function() {
            $scope.$applyAsync(function() {
                $scope.message = 'Caching errors';
            });
            var cache = buildCache();
            cache.forEach(function(entry) {
                var filename = `cache\\${entry.filename}-${entry.hash}.json`;
                fileHelpers.saveJsonFile(filename, sanitizeErrors(entry.errors));
            });
        };

        $scope.finalize = function() {
            $scope.$applyAsync(function() {
                $scope.message = 'Finalizing xEditLib';
                $scope.detailedMessage = '';
            });
            xelib.Finalize();
            $scope.$emit('terminate');
        };
    });
}
