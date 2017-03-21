import template from './iconText.html';
import controller from './iconText.controller';
import './iconText.scss';

let iconTextComponent = {
  restrict: 'E',
  bindings: {
    data: '<'
  },
  template,
  controller
};

export default iconTextComponent;
