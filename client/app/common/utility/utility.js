import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import utilityFactory from './utility.factory';

let utilityModule = angular.module('utility', [
  uiRouter,
  LogDecorator
])

.factory('Utility', utilityFactory)

.name;

export default utilityModule;
