import template from './radioList.html';
import controller from './radioList.controller';
import './radioList.scss';

let radioListComponent = {
  restrict: 'E',
  bindings: {
    data: '<',
    isTopLevelFormSubmitted: '<',
    onUpdate: '&'
  },
  template,
  controller
};

export default radioListComponent;
