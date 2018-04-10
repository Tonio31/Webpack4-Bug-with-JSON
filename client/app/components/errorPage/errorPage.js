import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import JwtServiceModule from 'common/jwtFactory/jwt';
import errorPageComponent from './errorPage.component';
import constantModule from 'common/constants';
import LoadingSpinnerModule from 'common/loadingSpinner/loadingSpinner';

let errorPageModule = angular.module('errorPage', [
  uiRouter,
  constantModule,
  LogDecorator,
  LoadingSpinnerModule,
  JwtServiceModule
])
.config(($stateProvider, STATES) => {
  'ngInject';

  $stateProvider
    .state(STATES.ERROR_PAGE_NO_MENU, {
      url: STATES.ERROR_PAGE_NO_MENU,
      parent: STATES.MAIN_NO_MENU,
      component: 'errorPage',
      params: {
        errorMsg: null,
        bugsnagMetaData: null,
        bugsnagErrorName: null
      }
    })
    .state(STATES.ERROR_PAGE, {
      url: STATES.ERROR_PAGE,
      parent: STATES.MAIN,
      component: 'errorPage',
      params: {
        errorMsg: null,
        bugsnagMetaData: null,
        bugsnagErrorName: null
      }
    });
})
.component('errorPage', errorPageComponent)

.name;

export default errorPageModule;
