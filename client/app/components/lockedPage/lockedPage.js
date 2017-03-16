import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import lockedPageComponent from './lockedPage.component';
import ConstantModule from 'common/constants';

let lockedPageModule = angular.module('lockedPage', [
  uiRouter,
  ConstantModule,
  LogDecorator
])
  .component('lockedPage', lockedPageComponent)

  .name;

export default lockedPageModule;
