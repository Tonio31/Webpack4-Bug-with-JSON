import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import spiderChartComponent from './spiderChart.component';

// import d3 from 'd3';
// import radarChartD3 from 'radar-chart-d3';

let spiderChartModule = angular.module('spiderChart', [
  uiRouter,
  LogDecorator
])

.component('spiderChart', spiderChartComponent)

.name;

export default spiderChartModule;
