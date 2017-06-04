export default function(ngapp, xelib, remote) {
    ngapp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('base', {
            url: '',
            redirectTo: 'base.start',
            templateUrl: 'partials/base.html',
            controller: 'baseController'
        });
    }]);

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
}
