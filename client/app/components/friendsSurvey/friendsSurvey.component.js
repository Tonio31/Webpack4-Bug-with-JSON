import template from './friendsSurvey.html';
import controller from './friendsSurvey.controller';
import './friendsSurvey.scss';

let friendsSurveyComponent = {
  restrict: 'E',
  bindings: {
    content: '<'
  },
  template,
  controller
};

export default friendsSurveyComponent;
