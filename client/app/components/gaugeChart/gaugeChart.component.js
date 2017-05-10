import template from './gaugeChart.html';
import controller from './gaugeChart.controller';
import './gaugeChart.scss';

let gaugeChartComponent = {
  restrict: 'E',
  bindings: {
    block: '<'
  },
  template,
  controller
};

export default gaugeChartComponent;
