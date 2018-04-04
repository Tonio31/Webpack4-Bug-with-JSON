import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import lockedPageComponent from './lockedPage.component';
import MenuService from 'common/menuFactory/menu';
import ConstantModule from 'common/constants';
import iconTextModule from 'components/iconText/iconText';

let lockedPageModule = angular.module('lockedPage', [
  uiRouter,
  ConstantModule,
  MenuService,
  iconTextModule,
  LogDecorator
])
.component('lockedPage', lockedPageComponent)

.name;

export default lockedPageModule;
