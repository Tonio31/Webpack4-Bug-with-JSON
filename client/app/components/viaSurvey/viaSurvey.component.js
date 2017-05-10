import template from './viaSurvey.html';
import controller from './viaSurvey.controller';
import './viaSurvey.scss';

let viaSurveyComponent = {
  restrict: 'E',
  bindings: {
    block: '<',
    isTopLevelFormSubmitted: '<',
    isStepCompleted: '<',
    navigation: '<',
    updateBlockManager: '&'
  },
  template,
  controller
};

export default viaSurveyComponent;
