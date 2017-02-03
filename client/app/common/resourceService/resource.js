import angular from 'angular';
import angularResource from 'angular-resource';
import ResourceFactory from './resource.factory';

let resourceServiceModule = angular.module('resourceService', [
  angularResource
])

.factory('Data', ResourceFactory)

.name;

export default resourceServiceModule;
