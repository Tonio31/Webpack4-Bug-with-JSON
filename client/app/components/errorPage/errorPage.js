import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import errorPageComponent from './errorPage.component';
import constantModule from 'common/constants';

let errorPageModule = angular.module('errorPage', [
  uiRouter,
  constantModule,
  LogDecorator
])
.config(($stateProvider, STATES) => {
  'ngInject';

  $stateProvider
    .state(STATES.ERROR_PAGE_NO_MENU, {
      url: STATES.ERROR_PAGE,
      parent: STATES.MAIN_NO_MENU,
      component: 'errorPage',
      params: {
        errorMsg: null
      }
    })
    .state(STATES.ERROR_PAGE, {
      url: STATES.ERROR_PAGE,
      parent: STATES.MAIN,
      component: 'errorPage',
      params: {
        errorMsg: null
      }
    });
})
.component('errorPage', errorPageComponent)

.name;

export default errorPageModule;
