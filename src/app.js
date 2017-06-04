// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import fh from './helpers/fileHelpers.js';
import env from './env';
import xelib from './xelib.js';
import settingsService from './Services/settingsService.js';
import xelibService from './Services/xelibService.js';
import profileService from './Services/profileService.js';
import formUtils from './Services/formUtils.js';
import errorsService from './Services/errorsService.js';
import profilesModal from './Directives/profilesModal.js';
import loadOrderModal from './Directives/loadOrderModal.js';
import settingsModal from './Directives/settingsModal.js';
import saveModal from './Directives/saveModal.js';
import resolveModal from './Directives/resolveModal.js';
import elementView from './Directives/elementView.js';
import baseView from './Views/base.js';
import startView from './Views/start.js';
import mainView from './Views/main.js';
import 'angular-spinner';

// set up helpers
var fileHelpers = fh(remote, jetpack);

// initialize xelib when application starts
xelib.Initialize();

// set up angular application
var ngapp = angular.module('shampoo', [
    'ui.router', 'ct.ui.router.extras', 'angularSpinner'
]);

ngapp.config(function ($urlMatcherFactoryProvider) {
    //this allows urls with and without trailing slashes to go to the same state
    $urlMatcherFactoryProvider.strictMode(false);
});

// SERVICES
xelibService(ngapp, xelib);
profileService(ngapp, xelib, fileHelpers);
formUtils(ngapp);

// FACTORIES
settingsService(ngapp, fileHelpers);
errorsService(ngapp, xelib);

// DIRECTIVES
elementView(ngapp);
profilesModal(ngapp);
loadOrderModal(ngapp, xelib);
resolveModal(ngapp);
settingsModal(ngapp);
saveModal(ngapp, xelib);

// VIEWS
baseView(ngapp, xelib, remote);
startView(ngapp, xelib);
mainView(ngapp, xelib, remote);
