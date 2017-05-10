import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import iconTextComponent from './iconText.component';
import UtilityFactory from 'common/utility/utility';
import ConstantModule from 'common/constants';
import filtersModule from 'common/filters/filters';

let iconTextModule = angular.module('iconText', [
  uiRouter,
  LogDecorator,
  filtersModule,
  UtilityFactory,
  ConstantModule
])

.component('iconText', iconTextComponent)

.name;

export default iconTextModule;
