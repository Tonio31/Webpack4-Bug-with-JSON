import angular from 'angular';
import uiRouter from 'angular-ui-router';
import courseContentComponent from './courseContent.component';
import LogDecorator from 'common/logDecorator/logDecorator';
import UserDataFactory from 'common/userDataFactory/userData';
import ResourceFactory from 'common/resourceFactory/resource';
import MenuService from 'common/menuFactory/menu';

let courseContentModule = angular.module('courseContent', [
  uiRouter,
  UserDataFactory,
  ResourceFactory,
  MenuService,
  LogDecorator
])

.component('courseContent', courseContentComponent)

.name;

export default courseContentModule;
