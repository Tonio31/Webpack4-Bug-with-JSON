import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import checkboxComponent from './checkbox.component';
import constantModule from 'common/constants';
import UtilityFactory from 'common/utility/utility';

let checkboxModule = angular.module('checkbox', [
  uiRouter,
  LogDecorator,
  constantModule,
  UtilityFactory
])

.component('checkbox', checkboxComponent)

.name;

export default checkboxModule;
