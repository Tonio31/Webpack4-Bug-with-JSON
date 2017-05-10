import template from './htmlModule.html';
import controller from './htmlModule.controller';
import './htmlModule.scss';

let htmlModuleComponent = {
  restrict: 'E',
  bindings: {
    data: '<'
  },
  template,
  controller
};

export default htmlModuleComponent;
