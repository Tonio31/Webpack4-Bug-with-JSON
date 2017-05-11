import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import ResourceFactory from 'common/resourceFactory/resource';
import UserDataFactory from 'common/userDataFactory/userData';
import viaSurveyComponent from './viaSurvey.component';
import CourseContentFactory from 'common/courseContentFactory/courseContentFactory';
import UtilityFactory from 'common/utility/utility';
import LoadingSpinnerModule from 'common/loadingSpinner/loadingSpinner';
import LangFactory from 'common/changeLanguage/changeLanguage';

let viaSurveyModule = angular.module('viaSurvey', [
  uiRouter,
  ResourceFactory,
  UserDataFactory,
  CourseContentFactory,
  LangFactory,
  LoadingSpinnerModule,
  UtilityFactory,
  LogDecorator
])

.component('viaSurvey', viaSurveyComponent)

.name;

export default viaSurveyModule;
