import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import JwtServiceModule from 'common/jwtFactory/jwt';
import errorPageComponent from './errorPage.component';
import constantModule from 'common/constants';

let errorPageModule = angular.module('errorPage', [
  uiRouter,
  constantModule,
  LogDecorator,
  JwtServiceModule
])
.component('errorPage', errorPageComponent)

.name;

export default errorPageModule;
