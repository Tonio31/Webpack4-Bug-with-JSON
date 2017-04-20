import template from './spiderChart.html';
import controller from './spiderChart.controller';
import './spiderChart.scss';

let spiderChartComponent = {
  restrict: 'E',
  bindings: {
    block: '<'
  },
  template,
  controller
};

export default spiderChartComponent;
