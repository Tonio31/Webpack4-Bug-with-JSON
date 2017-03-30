import template from './composed.html';
import controller from './composed.controller';
import './composed.scss';

let composedComponent = {
  restrict: 'E',
  bindings: {
    block: '<',
    isTopLevelFormSubmitted: '<',
    updateParent: '&'
  },
  template,
  controller
};

export default composedComponent;