import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import utilityFactory from './utility.factory';
import ngStorage from 'ngstorage-webpack';
import UserDataFactory from 'common/userDataFactory/userData';

let utilityModule = angular.module('utility', [
  uiRouter,
  LogDecorator,
  ngStorage,
  UserDataFactory
])

.factory('Utility', utilityFactory)

.name;

export default utilityModule;
