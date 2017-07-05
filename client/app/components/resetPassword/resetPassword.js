import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import resetPasswordComponent from './resetPassword.component';
import ResourceFactory from 'common/resourceFactory/resource';
import LoadingSpinnerModule from 'common/loadingSpinner/loadingSpinner';
import ConstantModule from 'common/constants';


let resetPasswordModule = angular.module('resetPassword', [
  uiRouter,
  LogDecorator,
  ResourceFactory,
  LoadingSpinnerModule,
  ConstantModule
])
.config(($stateProvider, STATES) => {
  'ngInject';

  $stateProvider
    .state(STATES.RESET_PASSWORD, {
      url: `${STATES.RESET_PASSWORD}?token&user_id`,
      parent: STATES.LOGIN_ROOT,
      component: 'resetPassword',
      reloadOnSearch : false,
    });
})
.component('resetPassword', resetPasswordComponent)

.name;

export default resetPasswordModule;
