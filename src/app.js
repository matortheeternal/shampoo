// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import env from './env';
import xelib from './xelib.js';
import xelibService from './Services/xelibService.js';
import profileService from './Services/profileService.js';
import formUtils from './Services/formUtils.js';
import errorsService from './Services/errorsService.js';
import profilesModal from './Directives/profilesModal.js';
import loadOrderModal from './Directives/loadOrderModal.js';
import resolveModal from './Directives/resolveModal.js';
import elementView from './Directives/elementView.js';
import baseView from './Views/base.js';
import startView from './Views/start.js';
import mainView from './Views/main.js';
import 'angular-spinner';

// set up electron application
var electron = {
    remote: remote,
    jetpack: jetpack
};

// set up angular application
var ngapp = angular.module('shampoo', [
    'ui.router', 'ct.ui.router.extras', 'angularSpinner'
]);

ngapp.config(function ($urlMatcherFactoryProvider) {
    //this allows urls with and without trailing slashes to go to the same state
    $urlMatcherFactoryProvider.strictMode(false);
});

ngapp.run(['$rootScope', '$state', function ($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (evt, toState, params, fromState) {
        if (toState.redirectTo) {
            evt.preventDefault();
            $state.go(toState.redirectTo, params, {location: 'replace'});
        }
    });
}]);

// SERVICES
xelibService(ngapp, xelib);
profileService(ngapp, xelib, electron);
formUtils(ngapp);

// FACTORIES
errorsService(ngapp, xelib);

// DIRECTIVES
profilesModal(ngapp);
loadOrderModal(ngapp, xelib);
resolveModal(ngapp);
elementView(ngapp);

// VIEWS
baseView(ngapp, xelib, electron);
startView(ngapp, xelib);
mainView(ngapp, xelib);

