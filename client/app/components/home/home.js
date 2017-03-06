import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';
import angularTranslate from 'angular-translate';
import ResourceFactory from 'common/resourceFactory/resource';
import UserDataFactory from 'common/userDataFactory/userData';
import MenuService from 'common/menuFactory/menu';
import JwtModule from 'common/jwtFactory/jwt';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';

let homeModule = angular.module('home', [
  uiRouter,
  angularTranslate,
  ResourceFactory,
  MenuService,
  LogDecorator,
  UserDataFactory,
  JwtModule,
  constantModule
])

  .config(($stateProvider, $urlRouterProvider, STATES) => {
    'ngInject';

    $stateProvider
      .state(STATES.HOME, {
        url: `/`,
        component: 'home',
        resolve: {
          content: (Data) => {
            'ngInject';
            return Data.getDynamicContentPromise('reflexion', true);
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
