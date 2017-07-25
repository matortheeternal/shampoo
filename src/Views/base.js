export default function(ngapp, xelib, remote) {
    ngapp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('base', {
            url: '',
            redirectTo: 'base.start',
            templateUrl: 'partials/base.html',
            controller: 'baseController'
        });
    }]);

    ngapp.controller('baseController', function ($scope, $document) {
        var hostWindow = remote.getCurrentWindow();

        $scope.helpClick = function () {
            //$scope.toggleHelpModal();
        };

        $scope.minimizeClick = function () {
            hostWindow.minimize();
        };

        $scope.restoreClick = function () {
            if (hostWindow.isMaximized()) {
                hostWindow.unmaximize();
            } else {
                hostWindow.maximize();
            }
        };

        $scope.closeClick = function () {
            hostWindow.close();
        };

        $scope.$on('terminate', function() {
            remote.app.forceClose = true;
            $scope.closeClick();
        });

        // keyboard shortcuts
        $document.bind('keypress', function(e) {
            // ctrl + shift + i OR F12
            if ((e.which === 9 && e.shiftKey && e.ctrlKey) || e.which === 123) {
                hostWindow.toggleDevTools();
            // f5
            } else if (e.which === 18 && e.ctrlKey) {
                location.reload();
            }
        });
    });
}
