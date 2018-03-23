import template from './navbar.menuButton.template.html';
import controller from './navbar.menuButton.controller';
import './navbar.menuButton.scss';

let navbarMenuButtonComponent = {
  restrict: 'E',
  bindings: {
    data: '<',
    category: '<',
    menuItemNumber: '<'
  },
  template,
  controller
};

export default navbarMenuButtonComponent;
