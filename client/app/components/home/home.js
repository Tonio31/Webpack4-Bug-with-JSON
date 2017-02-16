import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';
import angularTranslate from 'angular-translate';
import ResourceFactory from 'common/resourceFactory/resource';
import UserDataFactory from 'common/userDataFactory/userData';
import MenuService from 'common/menuFactory/menu';
import LogDecorator from 'common/logDecorator/logDecorator';

let homeModule = angular.module('home', [
  uiRouter,
  angularTranslate,
  ResourceFactory,
  MenuService,
  LogDecorator,
  UserDataFactory
])

.config(($stateProvider, $urlRouterProvider) => {
  'ngInject';
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      component: 'home',
      resolve: {
        dynamicContent: (Data) => {
          'ngInject';
          return Data.getHomeContent();
        }
      }
    });
})

.component('home', homeComponent)

.name;

export default homeModule;
