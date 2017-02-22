import angular from 'angular';
import uiRouter from 'angular-ui-router';
import courseContentComponent from './courseContent.component';
import LogDecorator from 'common/logDecorator/logDecorator';
import UserDataFactory from 'common/userDataFactory/userData';
import ResourceFactory from 'common/resourceFactory/resource';
import MenuService from 'common/menuFactory/menu';
import videoModule from '../videoModule/videoModule';
import { unsafeFilter } from './courseContent.filter';


let courseContentModule = angular.module('courseContent', [
  uiRouter,
  UserDataFactory,
  ResourceFactory,
  MenuService,
  videoModule,
  LogDecorator
])

.component('courseContent', courseContentComponent)
.filter('unsafe', unsafeFilter)
.name;

export default courseContentModule;
