import angular from 'angular';
import uiRouter from 'angular-ui-router';
import aboutComponent from './about.component';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';

let aboutModule = angular.module('about', [
  uiRouter,
  LogDecorator,
  constantModule
])

.config(($stateProvider, STATES) => {
  'ngInject';
  $stateProvider
    .state('about', {
      url: '/about',
      component: 'about',
      parent: STATES.APP
    });
})

.component('about', aboutComponent)

.name;

export default aboutModule;
