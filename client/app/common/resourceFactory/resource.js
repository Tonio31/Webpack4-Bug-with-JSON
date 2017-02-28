import angular from 'angular';
import angularResource from 'angular-resource';
import ResourceFactory from './resource.factory';

let resourceServiceModule = angular.module('resourceService', [
  angularResource
])


  .factory('Data', ResourceFactory)
  .constant('config', {
    apiUrl: 'http://apipl.ciprianspiridon.com/`',
    apiVersion: 'v1'
  })
  .name;

export default resourceServiceModule;
