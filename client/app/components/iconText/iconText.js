import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import iconTextComponent from './iconText.component';
import ConstantModule from 'common/constants';
import filtersModule from 'common/filters/filters';
import buttonModule from 'components/buttonModule/buttonModule';

let iconTextModule = angular.module('iconText', [
  uiRouter,
  LogDecorator,
  filtersModule,
  ConstantModule,
  buttonModule
])

.component('iconText', iconTextComponent)

.name;

export default iconTextModule;
