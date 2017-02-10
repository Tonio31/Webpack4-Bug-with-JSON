import angular from 'angular';
import globalVariable from 'app/globalVariables';
import UserDataFactory from 'common/userDataFactory/userData';
import ResourceFactory from 'common/resourceService/resource';
import MenuService from './menu.service';

let menuModule = angular.module('menu', [
  UserDataFactory,
  ResourceFactory,
  globalVariable
])

.factory('Menu', MenuService)

.name;

export default menuModule;
