import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import radioListComponent from './radioList.component';

let radioListModule = angular.module('radioList', [
  uiRouter,
  LogDecorator
])

.component('radioList', radioListComponent)

.name;

export default radioListModule;
