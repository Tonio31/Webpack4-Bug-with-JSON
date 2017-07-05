import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import utilityFactory from './utility.factory';
import ngStorage from 'ngstorage-webpack';
import ResourceFactory from 'common/resourceFactory/resource';
import UserDataFactory from 'common/userDataFactory/userData';

let utilityModule = angular.module('utility', [
  uiRouter,
  LogDecorator,
  ngStorage,
  ResourceFactory,
  UserDataFactory
])

.factory('Utility', utilityFactory)

.name;

export default utilityModule;
