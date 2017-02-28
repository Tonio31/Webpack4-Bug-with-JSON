import template from './courseContent.html';
import controller from './courseContent.controller';
import './courseContent.scss';

let courseContentComponent = {
  restrict: 'E',
  bindings: {
    content: '<'
  },
  template,
  controller
};

export default courseContentComponent;
