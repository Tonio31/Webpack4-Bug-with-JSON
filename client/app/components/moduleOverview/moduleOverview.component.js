import template from './moduleOverview.html';
import controller from './moduleOverview.controller';
import './moduleOverview.scss';

let moduleOverviewComponent = {
  restrict: 'E',
  bindings: {
    block: '<'
  },
  template,
  controller
};

export default moduleOverviewComponent;
