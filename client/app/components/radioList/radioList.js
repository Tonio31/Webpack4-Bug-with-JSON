import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';
import radioListComponent from './radioList.component';
import UtilityFactory from 'common/utility/utility';

let radioListModule = angular.module('radioList', [
  uiRouter,
  constantModule,
  LogDecorator,
  UtilityFactory
])

.component('radioList', radioListComponent)

.name;

export default radioListModule;
