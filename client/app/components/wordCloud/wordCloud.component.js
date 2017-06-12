import template from './wordCloud.html';
import controller from './wordCloud.controller';
import './wordCloud.scss';

let wordCloudComponent = {
  restrict: 'E',
  bindings: {
    block: '<'
  },
  template,
  controller
};

export default wordCloudComponent;
