import angular from 'angular';
import uiRouter from 'angular-ui-router';
import courseContentComponent from './courseContent.component';

let courseContentModule = angular.module('courseContent', [
  uiRouter
])

.component('courseContent', courseContentComponent)

.name;

export default courseContentModule;
