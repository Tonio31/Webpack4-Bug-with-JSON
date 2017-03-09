import angular from 'angular';
import angularResource from 'angular-resource';
import UserDataFactory from './userData.factory';

let userDataModule = angular.module('userData', [
  angularResource
])

  .factory('User', UserDataFactory)

  .name;

export default userDataModule;
