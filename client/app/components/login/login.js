import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import loginComponent from './login.component';
import MenuService from 'common/menuFactory/menu';
import ResourceFactory from 'common/resourceFactory/resource';
import ConstantModule from 'common/constants';

let loginModule = angular.module('login', [
  uiRouter,
  LogDecorator,
  MenuService,
  ResourceFactory,
  ConstantModule
])

.component('login', loginComponent)
  .config(($stateProvider, STATES) => {
    'ngInject';

    $stateProvider
      .state(STATES.LOGIN, {
        url: STATES.LOGIN,
        component: 'login',
        params: {
          stateToRedirect: STATES.HOME
        }
      });
  })

.name;

export default loginModule;
