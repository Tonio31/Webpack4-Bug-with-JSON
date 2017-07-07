import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import ResourceFactory from 'common/resourceFactory/resource';
import friendsSurveyComponent from './friendsSurvey.component';
import CourseContentFactory from 'common/courseContentFactory/courseContentFactory';
import ngStorage from 'ngstorage-webpack';
import constantModule from 'common/constants';

let friendsSurveyModule = angular.module('friendsSurvey', [
  uiRouter,
  ResourceFactory,
  CourseContentFactory,
  ngStorage,
  constantModule,
  LogDecorator
])
.config(($stateProvider, STATES) => {
  'ngInject';

  let registerState = (iPageNumber) => {
    let stateName = `${STATES.SURVEY}/${iPageNumber}`;
    let stateUrl = `${STATES.SURVEY}/${iPageNumber}`;

    let state = {
      name: stateName,
      url: stateUrl,
      parent: STATES.MAIN_NO_MENU,
      component: 'friendsSurvey',
      resolve: {
        content: (Data) => {
          'ngInject';
          return Data.getFriendSurveyContent({ page: iPageNumber });
        }
      },
      params: {
        page: iPageNumber
      }
    };

    $stateProvider.state(state);
  };

  registerState(1);
  registerState(2);
  registerState(3);

})
.component('friendsSurvey', friendsSurveyComponent)

.name;

export default friendsSurveyModule;
