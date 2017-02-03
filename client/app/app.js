//External Module
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'normalize.css';
require('angular-foundation');

//Potentialife module
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';


let appModule = angular.module('app', [
    'mm.foundation',
    uiRouter,
    Common,
    Components
  ])
  .config(($locationProvider) => {
    "ngInject";
    // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    // #how-to-configure-your-server-to-work-with-html5mode
    $locationProvider.html5Mode(true).hashPrefix('!');
  })

  .component('app', AppComponent)
  .name;

export default appModule;
