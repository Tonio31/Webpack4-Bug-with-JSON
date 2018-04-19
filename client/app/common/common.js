import angular from 'angular';
import LogDecorator from './logDecorator/logDecorator';

let commonModule = angular.module('app.common', [
  LogDecorator,
])
.name;

export default commonModule;
