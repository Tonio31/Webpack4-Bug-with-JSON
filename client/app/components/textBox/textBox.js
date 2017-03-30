import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';
import textBoxComponent from './textBox.component';
import UtilityFactory from 'common/utility/utility';

let textBoxModule = angular.module('textBox', [
  uiRouter,
  constantModule,
  LogDecorator,
  UtilityFactory
])

.component('textBox', textBoxComponent)

.name;

export default textBoxModule;
