import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import ResourceFactory from 'common/resourceFactory/resource';
import friendsSurveyComponent from './friendsSurvey.component';
import CourseContentFactory from 'common/courseContentFactory/courseContent';

let friendsSurveyModule = angular.module('friendsSurvey', [
  uiRouter,
  ResourceFactory,
  CourseContentFactory,
  LogDecorator
])
.config(($stateProvider, STATES) => {
  'ngInject';

  $stateProvider
    .state(STATES.SURVEY, {
      url: `/360_Survey/:pageNumber?token`,
      component: 'friendsSurvey',
      parent: STATES.MAIN_NO_MENU,
      resolve: {
        content: ($stateParams, Data) => {
          'ngInject';
          return Data.getDynamicContentPromise('survey', false, { page: $stateParams.pageNumber });
        }
      },
      params: {
        forceRedirect: null
      }
    });
})
.component('friendsSurvey', friendsSurveyComponent)

.name;

export default friendsSurveyModule;
