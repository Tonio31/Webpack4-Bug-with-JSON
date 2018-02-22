import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import ResourceFactory from 'common/resourceFactory/resource';
import UserDataFactory from 'common/userDataFactory/userData';
import viaSurveyComponent from './viaSurvey.component';
import CourseContentFactory from 'common/courseContentFactory/courseContentFactory';
import ErrorNotifierFactory from 'common/errorNotifier/errorNotifier';
import UtilityFactory from 'common/utility/utility';
import LoadingSpinnerModule from 'common/loadingSpinner/loadingSpinner';
import LangFactory from 'common/changeLanguage/changeLanguage';

let viaSurveyModule = angular.module('viaSurvey', [
  uiRouter,
  ResourceFactory,
  UserDataFactory,
  CourseContentFactory,
  ErrorNotifierFactory,
  LangFactory,
  LoadingSpinnerModule,
  UtilityFactory,
  LogDecorator
])

.component('viaSurvey', viaSurveyComponent)

.name;

export default viaSurveyModule;
