import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import moduleOverviewComponent from './moduleOverview.component';
import constantModule from 'common/constants';

let moduleOverviewModule = angular.module('moduleOverview', [
  uiRouter,
  LogDecorator,
  constantModule
])

.component('moduleOverview', moduleOverviewComponent)
.name;

export default moduleOverviewModule;
