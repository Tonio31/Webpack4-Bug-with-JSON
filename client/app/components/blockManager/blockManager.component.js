import template from './blockManager.html';
import controller from './blockManager.controller';

let blockManagerComponent = {
  restrict: 'E',
  bindings: {
    block: '<',
    isTopLevelFormSubmitted: '<',
    isStepCompleted: '<',
    updateParent: '&',
    disableNextButton: '&'
  },
  template,
  controller
};

export default blockManagerComponent;
