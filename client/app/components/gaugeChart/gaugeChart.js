import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import gaugeChartComponent from './gaugeChart.component';

let gaugeChartModule = angular.module('gaugeChart', [
  uiRouter,
  LogDecorator
])

.component('gaugeChart', gaugeChartComponent)

.name;

export default gaugeChartModule;
