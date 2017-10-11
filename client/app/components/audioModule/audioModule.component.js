import template from './audioModule.html';
import controller from './audioModule.controller';
import './audioModule.scss';

let audioModuleComponent = {
  restrict: 'E',
  bindings: {
    data: '<'
  },
  template,
  controller
};

export default audioModuleComponent;
