import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import { unsafeFilter } from './filters.filter';

let filtersModule = angular.module('filters', [
  uiRouter,
  LogDecorator
])
  .filter('unsafe', unsafeFilter)

.name;

export default filtersModule;
