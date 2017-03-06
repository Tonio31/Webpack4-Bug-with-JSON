import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import pageNotFoundComponent from './pageNotFound.component';
import constantModule from 'common/constants';

let pageNotFoundModule = angular.module('pageNotFound', [
  uiRouter,
  LogDecorator,
  constantModule
])
  .config(($stateProvider, $urlRouterProvider, STATES) => {
    'ngInject';

    $stateProvider
      .state(STATES.PAGE_NOT_FOUND, {
        url: STATES.PAGE_NOT_FOUND,
        component: 'pageNotFound',
      });
  })
  .component('pageNotFound', pageNotFoundComponent)

  .name;

export default pageNotFoundModule;
