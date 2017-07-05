import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import wordCloudComponent from './wordCloud.component';
import globalVariable from 'app/globalVariables';

let wordCloudModule = angular.module('wordCloud', [
  uiRouter,
  globalVariable,
  LogDecorator
])

.component('wordCloud', wordCloudComponent)

.name;

export default wordCloudModule;
