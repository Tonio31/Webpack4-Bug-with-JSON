import template from './checkbox.html';
import controller from './checkbox.controller';
import './checkbox.scss';

let checkboxComponent = {
  restrict: 'E',
  bindings: {
    data: '<',
    isTopLevelFormSubmitted: '<',
    onUpdate: '&'
  },
  template,
  controller
};

export default checkboxComponent;
