import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import blockManagerComponent from './blockManager.component';
import constantModule from 'common/constants';

let blockManagerModule = angular.module('blockManager', [
  uiRouter,
  LogDecorator,
  constantModule
])

.component('blockManager', blockManagerComponent)

.name;

export default blockManagerModule;
