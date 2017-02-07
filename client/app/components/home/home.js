import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';
import angularTranslate from 'angular-translate';
import ResourceFactory from 'common/resourceService/resource';
import UserDataFactory from 'common/userDataFactory/userData';

let homeModule = angular.module('home', [
  uiRouter,
  angularTranslate,
  ResourceFactory,
  UserDataFactory
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      component: 'home'
    });
})

.component('home', homeComponent)

.name;

export default homeModule;
