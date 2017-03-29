import template from './blockManager.html';
import controller from './blockManager.controller';

let blockManagerComponent = {
  restrict: 'E',
  bindings: {
    block: '<',
    isTopLevelFormSubmitted: '<',
    updateParent: '&'
  },
  template,
  controller
};

export default blockManagerComponent;
