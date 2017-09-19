import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import audioModuleComponent from './audioModule.component';
import ngAudio from 'angular-audio';
import { plProgressTranformer } from './audioModule.directive';

let audioModuleModule = angular.module('audioModule', [
  uiRouter,
  LogDecorator,
  ngAudio
])

.component('audioModule', audioModuleComponent)
.directive('plProgressTranformer', plProgressTranformer )

.name;

export default audioModuleModule;
