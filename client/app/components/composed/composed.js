import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';
import composedComponent from './composed.component';

let composedModule = angular.module('composed', [
  uiRouter,
  constantModule,
  LogDecorator
])

.component('composed', composedComponent)

.name;

export default composedModule;
