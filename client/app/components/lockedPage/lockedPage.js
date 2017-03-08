import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import lockedPageComponent from './lockedPage.component';

let lockedPageModule = angular.module('lockedPage', [
  uiRouter,
  LogDecorator
])
  .component('lockedPage', lockedPageComponent)

  .name;

export default lockedPageModule;
