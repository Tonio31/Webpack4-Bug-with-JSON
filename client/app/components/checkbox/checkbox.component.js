import template from './checkbox.html';
import controller from './checkbox.controller';
import './checkbox.scss';

let checkboxComponent = {
  restrict: 'E',
  bindings: {
    block: '<',
    isTopLevelFormSubmitted: '<',
    isStepCompleted: '<',
    updateBlockManager: '&'
  },
  template,
  controller
};

export default checkboxComponent;
