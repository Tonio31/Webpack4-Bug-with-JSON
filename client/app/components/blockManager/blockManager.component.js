import template from './blockManager.html';
import controller from './blockManager.controller';

let blockManagerComponent = {
  restrict: 'E',
  bindings: {
    block: '<',
    isTopLevelFormSubmitted: '<',
    isStepCompleted: '<',
    navigation: '<',
    updateParent: '&'
  },
  template,
  controller
};

export default blockManagerComponent;
