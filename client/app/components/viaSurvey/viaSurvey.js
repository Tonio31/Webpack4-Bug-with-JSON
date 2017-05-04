import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import ResourceFactory from 'common/resourceFactory/resource';
import UserDataFactory from 'common/userDataFactory/userData';
import viaSurveyComponent from './viaSurvey.component';
import CourseContentFactory from 'common/courseContentFactory/courseContent';

let viaSurveyModule = angular.module('viaSurvey', [
  uiRouter,
  ResourceFactory,
  UserDataFactory,
  CourseContentFactory,
  LogDecorator
])

.component('viaSurvey', viaSurveyComponent)

.name;

export default viaSurveyModule;
