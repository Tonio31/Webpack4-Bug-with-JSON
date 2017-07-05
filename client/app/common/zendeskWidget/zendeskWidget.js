import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import ZendeskWidgetFactory from './zendeskWidget.factory';

let zendeskWidgetModule = angular.module('zendeskWidget', [
  uiRouter,
  LogDecorator
])

.factory('ZendeskWidget', ZendeskWidgetFactory)

.name;

export default zendeskWidgetModule;
