import template from './barChart.html';
import controller from './barChart.controller';
import './barChart.scss';

let barChartComponent = {
  restrict: 'E',
  bindings: {
    block: '<'
  },
  template,
  controller
};

export default barChartComponent;
