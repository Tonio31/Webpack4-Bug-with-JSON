import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';
import unorderedListComponent from './unorderedList.component';

let unorderedListModule = angular.module('unorderedList', [
  uiRouter,
  constantModule,
  LogDecorator
])

.component('unorderedList', unorderedListComponent)

.name;

export default unorderedListModule;
