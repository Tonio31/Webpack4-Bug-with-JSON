import angular from 'angular';
import uiRouter from 'angular-ui-router';
import aboutComponent from './about.component';
import LogDecorator from 'common/logDecorator/logDecorator';

let aboutModule = angular.module('about', [
  uiRouter,
  LogDecorator
])

.config(($stateProvider) => {
  'ngInject';
  $stateProvider
    .state('about', {
      url: '/about',
      component: 'about'
    });
})

.component('about', aboutComponent)

.name;

export default aboutModule;
