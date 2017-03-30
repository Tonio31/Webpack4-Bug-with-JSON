import angular from 'angular';
import uiRouter from 'angular-ui-router';
import courseContentComponent from './courseContent.component';
import LogDecorator from 'common/logDecorator/logDecorator';
import UserDataFactory from 'common/userDataFactory/userData';
import ResourceFactory from 'common/resourceFactory/resource';
import UtilityFactory from 'common/utility/utility';
import MenuService from 'common/menuFactory/menu';
import blockManager from 'components/blockManager/blockManager';
import constantModule from 'common/constants';
import filtersModule from 'common/filters/filters';


let courseContentModule = angular.module('courseContent', [
  uiRouter,
  UserDataFactory,
  ResourceFactory,
  UtilityFactory,
  MenuService,
  constantModule,
  blockManager,
  filtersModule,
  LogDecorator
])
  .component('courseContent', courseContentComponent)
  .name;

export default courseContentModule;
