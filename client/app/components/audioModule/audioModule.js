import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import audioModuleComponent from './audioModule.component';
import ngAudio from 'angular-audio';

let audioModuleModule = angular.module('audioModule', [
  uiRouter,
  LogDecorator,
  ngAudio
])

.component('audioModule', audioModuleComponent)

.name;

export default audioModuleModule;
