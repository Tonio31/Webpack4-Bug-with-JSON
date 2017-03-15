import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';
import radioListComponent from './radioList.component';

let radioListModule = angular.module('radioList', [
  uiRouter,
  constantModule,
  LogDecorator
])

.component('radioList', radioListComponent)

.name;

export default radioListModule;
