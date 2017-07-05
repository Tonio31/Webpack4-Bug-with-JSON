import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import NavBarComponent from 'common/navbar/navbar';
import FooterComponent from 'common/footer/footer';
import mainComponent from './main.component';
import ConstantModule from 'common/constants';
import ngStorage from 'ngstorage-webpack';
import CourseContentFactory from 'common/courseContentFactory/courseContentFactory';

let mainModule = angular.module('main', [
  uiRouter,
  NavBarComponent,
  FooterComponent,
  ConstantModule,
  ngStorage,
  CourseContentFactory,
  LogDecorator
])
.config( ($stateProvider, STATES) => {
  'ngInject';
  $stateProvider.state(STATES.MAIN, {
    abstract: true,
    component: 'main',
    params: {
      displayMenu: true
    }
  });

  $stateProvider.state(STATES.MAIN_NO_MENU, {
    abstract: true,
    component: 'main',
    params: {
      displayMenu: false
    }
  });
})

.component('main', mainComponent)

.name;

export default mainModule;
