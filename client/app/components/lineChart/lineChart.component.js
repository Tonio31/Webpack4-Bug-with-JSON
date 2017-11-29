import template from './lineChart.html';
import controller from './lineChart.controller';
import './lineChart.scss';

let lineChartComponent = {
  restrict: 'E',
  bindings: {
    block: '<'
  },
  template,
  controller
};

export default lineChartComponent;
