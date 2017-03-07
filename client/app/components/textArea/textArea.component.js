import template from './textArea.html';
import controller from './textArea.controller';
import './textArea.scss';

let textAreaComponent = {
  restrict: 'E',
  bindings: {
    block: '<',
    isTopLevelFormSubmitted: '<',
    onUpdate: '&'
  },
  template,
  controller
};

export default textAreaComponent;
