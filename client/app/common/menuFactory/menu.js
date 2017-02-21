import angular from 'angular';
import globalVariable from 'app/globalVariables';
import UserDataFactory from 'common/userDataFactory/userData';
import ResourceFactory from 'common/resourceFactory/resource';
import LogDecorator from 'common/logDecorator/logDecorator';
import MenuFactory from './menu.factory';

let menuModule = angular.module('menu', [
  UserDataFactory,
  ResourceFactory,
  LogDecorator,
  globalVariable
])

.factory('Menu', MenuFactory)

.name;

export default menuModule;