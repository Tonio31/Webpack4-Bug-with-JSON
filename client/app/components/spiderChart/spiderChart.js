import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import spiderChartComponent from './spiderChart.component';
import globalVariable from 'app/globalVariables';

import 'c3-angular';

let spiderChartModule = angular.module('spiderChart', [
  uiRouter,
  'gridshore.c3js.chart',
  globalVariable,
  LogDecorator
])

.component('spiderChart', spiderChartComponent)

.name;

export default spiderChartModule;
