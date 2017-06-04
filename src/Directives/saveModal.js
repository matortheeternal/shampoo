export default function(ngapp, xelib) {
    ngapp.directive('saveModal', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/saveModal.html',
            controller: 'saveModalController',
            scope: false
        }
    });

    ngapp.controller('saveModalController', function($scope, $timeout) {
        $scope.message = 'Saving data';
        $scope.detailedMessage = '';
        $scope.pluginsToSave = $scope.plugins.filter(function(plugin) {
            return plugin.hasOwnProperty('errors');
        });
        $scope.total = $scope.pluginsToSave.length;

        $scope.save = function() {
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
                        error.resolution.execute(error);
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
                xelib.SaveFile(plugin._id);
            });
        };

        $scope.saveCache = function() {
            // TODO
        };

        $scope.finalize = function() {
            $scope.$applyAsync(function() {
                $scope.message = 'Finalizing xEditLib';
                $scope.detailedMessage = '';
            });
            xelib.Finalize();
            $scope.$emit('terminate');
        };

        // save things
        $scope.save();
    });
}
