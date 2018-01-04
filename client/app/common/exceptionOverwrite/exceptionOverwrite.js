import angular from 'angular';
import angularResource from 'angular-resource';
import ExceptionOverwriteFactory from './exceptionOverwrite.factory';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';

let exceptionOverwriteModule = angular.module('exceptionOverwriteModule', [
  angularResource,
  LogDecorator,
  constantModule
])
.factory('$exceptionHandler', ExceptionOverwriteFactory)
.name;

export default exceptionOverwriteModule;
