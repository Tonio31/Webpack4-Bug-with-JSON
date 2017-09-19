import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import homeComponent from './home.component';
import angularTranslate from 'angular-translate';
import ResourceFactory from 'common/resourceFactory/resource';
import UserDataFactory from 'common/userDataFactory/userData';
import MenuService from 'common/menuFactory/menu';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';
import 'c3-angular';

let homeModule = angular.module('home', [
  uiRouter,
  angularTranslate,
  'gridshore.c3js.chart',
  ResourceFactory,
  MenuService,
  LogDecorator,
  UserDataFactory,
  constantModule
])

.config(($stateProvider, STATES) => {
  'ngInject';

  $stateProvider
    .state(STATES.HOME, {
      url: `/`,
      component: 'home',
      parent: STATES.MAIN,
      resolve: {
        content: (Data, $log) => {
          'ngInject';
          return Data.getDynamicContentPromise('reflexion', false);
        }
      },
      params: {
        forceRedirect: null
      }
    });
})

.component('home', homeComponent)
.name;

export default homeModule;
