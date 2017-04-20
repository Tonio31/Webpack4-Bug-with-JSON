import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import loginRootComponent from './loginRoot.component';
import LoadingSpinnerModule from 'common/loadingSpinner/loadingSpinner';
import ConstantModule from 'common/constants';

let loginRootModule = angular.module('loginRoot', [
  uiRouter,
  LogDecorator,
  LoadingSpinnerModule,
  ConstantModule
])
.config(($stateProvider, STATES) => {
  'ngInject';

  $stateProvider
    .state(STATES.LOGIN_ROOT, {
      abstract: true,
      component: 'loginRoot',
    });
})
.component('loginRoot', loginRootComponent)

.name;

export default loginRootModule;
