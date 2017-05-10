import template from './textBox.html';
import controller from './textBox.controller';
import './textBox.scss';

let textBoxComponent = {
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

export default textBoxComponent;
