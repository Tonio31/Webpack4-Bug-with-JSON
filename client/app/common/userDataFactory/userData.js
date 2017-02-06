import angular from 'angular';
import angularResource from 'angular-resource';
import UserDataFactory from './userData.factory';

let userDataModule = angular.module('userInfo', [
  angularResource
])

  .factory('UserInfo', UserDataFactory)

  .name;

export default userDataModule;
