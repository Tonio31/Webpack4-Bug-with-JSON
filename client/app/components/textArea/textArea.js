import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';
import textAreaComponent from './textArea.component';
import UtilityFactory from 'common/utility/utility';

let textAreaModule = angular.module('textArea', [
  uiRouter,
  constantModule,
  LogDecorator,
  UtilityFactory
])

.component('plTextArea', textAreaComponent)

.name;

export default textAreaModule;
