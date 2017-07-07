import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import barChartComponent from './barChart.component';

import 'c3-angular';

let barChartModule = angular.module('barChart', [
  uiRouter,
  'gridshore.c3js.chart',
  LogDecorator
])

.component('barChart', barChartComponent)
.constant('COLUMN_ID', {
  remaining: 'pl2-remaining', // if you change this value, don't forget to also change the class name in barChart.scss
  spaceOnTop: 'pl2-spaceOnTop',
  xLabels: 'pl2-x-label'
})
.name;

export default barChartModule;
