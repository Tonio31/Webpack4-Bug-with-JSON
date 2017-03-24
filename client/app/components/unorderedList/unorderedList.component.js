import template from './unorderedList.html';
import controller from './unorderedList.controller';
import './unorderedList.scss';

let unorderedListComponent = {
  restrict: 'E',
  bindings: {
    block: '<'
  },
  template,
  controller
};

export default unorderedListComponent;
