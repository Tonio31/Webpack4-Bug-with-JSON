import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import constantModule from 'common/constants';
import textBoxComponent from './textBox.component';

let textBoxModule = angular.module('textBox', [
  uiRouter,
  constantModule,
  LogDecorator
])

.component('textBox', textBoxComponent)

.name;

export default textBoxModule;
