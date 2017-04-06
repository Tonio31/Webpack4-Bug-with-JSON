import angular from 'angular';
import angularResource from 'angular-resource';
import UserDataFactory from 'common/userDataFactory/userData';
import ResourceFactory from './resource.factory';
import JwtFactory from 'common/jwtFactory/jwt';

let resourceServiceModule = angular.module('resourceService', [
  angularResource,
  UserDataFactory,
  JwtFactory
])
  .factory('Data', ResourceFactory)
  .constant('config', {
    apiUrl: 'https://apipl.ciprianspiridon.com/',
    apiVersion: 'v1',
    apiViaSurvey: 'https://www.viacharacter.org/survey/api1/'
  })
  .name;

export default resourceServiceModule;
