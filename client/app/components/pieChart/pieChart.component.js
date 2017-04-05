import template from './pieChart.html';
import controller from './pieChart.controller';
import './pieChart.scss';

let pieChartComponent = {
  restrict: 'E',
  bindings: {
    block: '<'
  },
  template,
  controller
};

export default pieChartComponent;
