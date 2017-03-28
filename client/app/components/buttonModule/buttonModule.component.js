import template from './buttonModule.html';
import controller from './buttonModule.controller';
import './buttonModule.scss';

let buttonModuleComponent = {
  restrict: 'E',
  bindings: {
    block: '<'
  },
  template,
  controller
};

export default buttonModuleComponent;
