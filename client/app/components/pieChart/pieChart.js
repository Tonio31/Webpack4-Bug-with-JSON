import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import pieChartComponent from './pieChart.component';

let pieChartModule = angular.module('pieChart', [
  uiRouter,
  LogDecorator
])

.component('pieChart', pieChartComponent)

.name;

export default pieChartModule;