export default function(ngapp) {
    ngapp.directive('elementView', function () {
        return {
            restrict: 'E',
            templateUrl: 'directives/elementView.html',
            scope: {
                element: '='
            }
        }
    });
}
