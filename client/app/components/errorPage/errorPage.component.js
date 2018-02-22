import template from './errorPage.html';
import controller from './errorPage.controller';
import './errorPage.scss';

let errorPageComponent = {
  restrict: 'E',
  bindings: {
    data: '<'
  },
  template,
  controller
};

export default errorPageComponent;
