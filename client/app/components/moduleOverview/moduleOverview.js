import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import moduleOverviewComponent from './moduleOverview.component';

let moduleOverviewModule = angular.module('moduleOverview', [
  uiRouter,
  LogDecorator
])

.component('moduleOverview', moduleOverviewComponent)

.name;

export default moduleOverviewModule;
