import template from './radioList.html';
import controller from './radioList.controller';
import './radioList.scss';

let radioListComponent = {
  restrict: 'E',
  bindings: {
    block: '<',
    isTopLevelFormSubmitted: '<',
    onUpdate: '&'
  },
  template,
  controller
};

export default radioListComponent;
