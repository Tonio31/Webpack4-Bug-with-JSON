import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import spiderChartComponent from './spiderChart.component';

import RadarChart from '../../lib/radar-chart/radar-chart';

let spiderChartModule = angular.module('spiderChart', [
  uiRouter,
  //RadarChart,
  LogDecorator
])

.component('spiderChart', spiderChartComponent)

.name;

export default spiderChartModule;
