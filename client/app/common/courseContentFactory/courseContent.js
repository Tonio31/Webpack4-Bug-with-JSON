import angular from 'angular';
import angularResource from 'angular-resource';
import CourseContentFactory from './courseContent.factory';

let userDataModule = angular.module('courseContentFactory', [
  angularResource
])

  .factory('ContentFactory', CourseContentFactory)

  .name;

export default userDataModule;
