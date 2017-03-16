import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import lockedPageComponent from './lockedPage.component';
import MenuService from 'common/menuFactory/menu';
import ConstantModule from 'common/constants';

let lockedPageModule = angular.module('lockedPage', [
  uiRouter,
  ConstantModule,
  MenuService,
  LogDecorator
])
  .component('lockedPage', lockedPageComponent)

  .name;

export default lockedPageModule;
