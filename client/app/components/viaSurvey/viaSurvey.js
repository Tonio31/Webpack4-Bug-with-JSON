import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import ResourceFactory from 'common/resourceFactory/resource';
import viaSurveyComponent from './viaSurvey.component';

let viaSurveyModule = angular.module('viaSurvey', [
  uiRouter,
  ResourceFactory,
  LogDecorator
])

.component('viaSurvey', viaSurveyComponent)

.name;

export default viaSurveyModule;
