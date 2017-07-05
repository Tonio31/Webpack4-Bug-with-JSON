import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import htmlModuleComponent from './htmlModule.component';
import filtersModule from 'common/filters/filters';

let htmlModuleModule = angular.module('htmlModule', [
  uiRouter,
  LogDecorator,
  filtersModule
])

.component('htmlModule', htmlModuleComponent)

.name;

export default htmlModuleModule;
