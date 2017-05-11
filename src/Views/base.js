export default function(ngapp, xelib, electron) {
    var remote = electron.remote;

    ngapp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('base', {
            url: '',
            redirectTo: 'base.start',
            templateUrl: 'partials/base.html',
            controller: 'baseController'
        });
    }]);

    ngapp.controller('baseController', function ($scope, xelibService) {
        // initialize xedit-lib
        xelib.Initialize();
        xelibService.testGetGlobal();

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
}
