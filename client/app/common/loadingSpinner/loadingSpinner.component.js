import template from './loadingSpinner.html';
import controller from './loadingSpinner.controller';
import './loadingSpinner.scss';

let loadingSpinnerComponent = {
  restrict: 'E',
  bindings: {
    name: '<',
    show: '<',
    displayLogo: '<',
    displayMessage: '<'
  },
  template,
  controller
};

export default loadingSpinnerComponent;
