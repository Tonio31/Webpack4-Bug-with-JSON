import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import <%= name %>Component from './<%= name %>.component';

let <%= name %>Module = angular.module('<%= name %>', [
  uiRouter,
  LogDecorator
])

.component('<%= name %>', <%= name %>Component)

.name;

export default <%= name %>Module;
