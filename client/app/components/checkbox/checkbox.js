import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import checkboxComponent from './checkbox.component';
import constantModule from 'common/constants';

let checkboxModule = angular.module('checkbox', [
  uiRouter,
  LogDecorator,
  constantModule
])

.component('checkbox', checkboxComponent)

.name;

export default checkboxModule;
