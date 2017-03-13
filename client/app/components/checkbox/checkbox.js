import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import checkboxComponent from './checkbox.component';

let checkboxModule = angular.module('checkbox', [
  uiRouter,
  LogDecorator
])

.component('checkbox', checkboxComponent)

.name;

export default checkboxModule;
