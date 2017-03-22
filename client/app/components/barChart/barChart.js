import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import barChartComponent from './barChart.component';

let barChartModule = angular.module('barChart', [
  uiRouter,
  LogDecorator
])

.component('barChart', barChartComponent)

.name;

export default barChartModule;
