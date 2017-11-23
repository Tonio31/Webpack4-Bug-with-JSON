import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import lineChartComponent from './lineChart.component';

let lineChartModule = angular.module('lineChart', [
  uiRouter,
  LogDecorator
])

.component('lineChart', lineChartComponent)
.name;

export default lineChartModule;
