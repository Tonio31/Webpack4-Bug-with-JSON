import angular from 'angular';
import angularResource from 'angular-resource';
import CourseContentFactory from './courseContent.factory';
import LogDecorator from 'common/logDecorator/logDecorator';

let userDataModule = angular.module('courseContentFactory', [
  angularResource,
  LogDecorator
])

.factory('ContentFactory', CourseContentFactory)

.name;

export default userDataModule;
