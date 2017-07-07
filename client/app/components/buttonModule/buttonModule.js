import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import UtilityFactory from 'common/utility/utility';
import buttonModuleComponent from './buttonModule.component';

let buttonModuleModule = angular.module('buttonModule', [
  uiRouter,
  UtilityFactory,
  LogDecorator
])

.component('buttonModule', buttonModuleComponent)

.name;

export default buttonModuleModule;
