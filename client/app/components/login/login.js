import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import loginComponent from './login.component';
import { plSubmit } from './login.directive';
import MenuService from 'common/menuFactory/menu';
import JwtFactory from 'common/jwtFactory/jwt';
import UserDataFactory from 'common/userDataFactory/userData';
import ResourceFactory from 'common/resourceFactory/resource';
import LoadingSpinnerModule from 'common/loadingSpinner/loadingSpinner';
import ConstantModule from 'common/constants';

let loginModule = angular.module('login', [
  uiRouter,
  LogDecorator,
  MenuService,
  JwtFactory,
  UserDataFactory,
  ResourceFactory,
  LoadingSpinnerModule,
  ConstantModule
])

.component('login', loginComponent)
.directive('plSubmit', plSubmit)
.config(($stateProvider, STATES) => {
  'ngInject';

  $stateProvider
    .state(STATES.LOGIN, {
      url: `${STATES.LOGIN}?target`,
      parent: STATES.LOGIN_ROOT,
      component: 'login',
      params: {
        stateToRedirect: STATES.HOME
      }
    });
})

.name;

export default loginModule;
