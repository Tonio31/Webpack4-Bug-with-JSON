import angular from 'angular';
import angularResource from 'angular-resource';
import ErrorNotifierFactory from '../errorNotifier/errorNotifier.factory';
import LogDecorator from 'common/logDecorator/logDecorator';

let ErrorNotifierModule = angular.module('errorNotifierModule', [
  angularResource,
  LogDecorator
])
.factory('ErrorNotifierFactory', ErrorNotifierFactory)
.name;

export default ErrorNotifierModule;
