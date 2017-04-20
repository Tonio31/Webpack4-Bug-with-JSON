import angular from 'angular';
import UserDataFactory from 'common/userDataFactory/userData';
import ResourceFactory from 'common/resourceFactory/resource';
import LogDecorator from 'common/logDecorator/logDecorator';
import SpinnerComponent from './loadingSpinner.component';
import SpinnerFactory from './loadingSpinner.factory';

let menuModule = angular.module('loadingSpinner', [
  UserDataFactory,
  ResourceFactory,
  LogDecorator
])

.component('spinner', SpinnerComponent)
.factory('SpinnerFactory', SpinnerFactory)

.name;

export default menuModule;
