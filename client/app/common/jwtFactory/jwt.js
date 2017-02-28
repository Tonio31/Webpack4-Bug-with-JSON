import angular from 'angular';
import JwtFactory from './jwt.factory';
import AuthInterceptorFactory from './authInterceptor.factory';
import ngStorage from 'ngstorage-webpack';

let jwtServiceModule = angular.module('jwtService', [
  ngStorage
])
  .constant('config', {
    apiUrl: 'http://apipl.ciprianspiridon.com/',
    apiVersion: 'v1'
  })
  .factory('JwtFactory', JwtFactory)
  .factory('AuthInterceptor', AuthInterceptorFactory)
  .config( ($httpProvider) => {
    'ngInject';
    $httpProvider.interceptors.push('AuthInterceptor');
  })
  .name;

export default jwtServiceModule;
