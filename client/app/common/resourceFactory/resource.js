import angular from 'angular';
import angularResource from 'angular-resource';
import UserDataFactory from 'common/userDataFactory/userData';
import ResourceFactory from './resource.factory';
import JwtFactory from 'common/jwtFactory/jwt';
import ConstantModule from 'common/constants';

let resourceServiceModule = angular.module('resourceService', [
  angularResource,
  UserDataFactory,
  ConstantModule,
  JwtFactory
])
  .factory('Data', ResourceFactory)
  .name;

export default resourceServiceModule;
