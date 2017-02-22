import template from './videoModule.html';
import controller from './videoModule.controller';
import './videoModule.scss';

let videoComponent = {
  restrict: 'E',
  bindings: {
    data: '<'
  },
  template,
  controller
};

export default videoComponent;
