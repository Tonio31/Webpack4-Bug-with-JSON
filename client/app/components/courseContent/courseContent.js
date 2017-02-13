import angular from 'angular';
import uiRouter from 'angular-ui-router';
import courseContentComponent from './courseContent.component';
import LogDecorator from 'common/logDecorator/logDecorator';

let courseContentModule = angular.module('courseContent', [
  uiRouter,
  LogDecorator
])

.component('courseContent', courseContentComponent)

.name;

export default courseContentModule;
