import template from './radioList.html';
import controller from './radioList.controller';
import './radioList.scss';

let radioListComponent = {
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

export default radioListComponent;
