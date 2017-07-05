import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import pageNotFoundComponent from './pageNotFound.component';
import MenuService from 'common/menuFactory/menu';
import constantModule from 'common/constants';
import JwtFactory from 'common/jwtFactory/jwt';

let pageNotFoundModule = angular.module('pageNotFound', [
  uiRouter,
  LogDecorator,
  MenuService,
  JwtFactory,
  constantModule
])
.config(($stateProvider, STATES) => {
  'ngInject';

  $stateProvider
    .state(STATES.PAGE_NOT_FOUND_NO_MENU, {
      url: STATES.PAGE_NOT_FOUND,
      parent: STATES.MAIN_NO_MENU,
      component: 'pageNotFound',
      params: {
        intendedUrl: null
      }
    })
    .state(STATES.PAGE_NOT_FOUND, {
      url: STATES.PAGE_NOT_FOUND,
      parent: STATES.MAIN,
      component: 'pageNotFound',
      params: {
        intendedUrl: null
      }
    });
})
.component('pageNotFound', pageNotFoundComponent)

.name;

export default pageNotFoundModule;
