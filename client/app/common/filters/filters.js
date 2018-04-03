import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import { unsafeFilter, secondsToTimeFilter } from './filters.filter';

let filtersModule = angular.module('filters', [
  uiRouter,
  LogDecorator
])
.filter('unsafe', unsafeFilter)
.filter('secondsToTime', secondsToTimeFilter)

.name;

export default filtersModule;
