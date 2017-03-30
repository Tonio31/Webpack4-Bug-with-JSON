import angular from 'angular';
import uiRouter from 'angular-ui-router';
import JwtFactory from './jwt.factory';
import AuthInterceptorFactory from './authInterceptor.factory';
import ngStorage from 'ngstorage-webpack';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';


// This module handles Authentication, it uses JWT (JSON Web Token)
// Have a look at this tutorial to understand how it works:
//   https://thinkster.io/tutorials/angularjs-jwt-auth

let jwtServiceModule = angular.module('jwtService', [
  uiRouter,
  ngStorage,
  LogDecorator,
  constantModule
])
  .factory('JwtFactory', JwtFactory)
  .factory('AuthInterceptor', AuthInterceptorFactory)
  .config( ($httpProvider) => {
    'ngInject';
    $httpProvider.interceptors.push('AuthInterceptor');
  })
  .name;

export default jwtServiceModule;
