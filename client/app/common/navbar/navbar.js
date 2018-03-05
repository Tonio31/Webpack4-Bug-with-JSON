import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import globalVariable from 'app/globalVariables';
import navbarComponent from './navbar.component';
import ResourceFactory from 'common/resourceFactory/resource';
import LogDecorator from 'common/logDecorator/logDecorator';
import MenuService from 'common/menuFactory/menu';
import constantModule from 'common/constants';
import LoadingSpinnerModule from 'common/loadingSpinner/loadingSpinner';
import ZendeskWidgetFactory from 'common/zendeskWidget/zendeskWidget';
import { syncMenuAndState, menuItem, menuButton, plDisableLink } from './navbar.directive';

require('angular-foundation');

let navbarModule = angular.module('navbar', [
  uiRouter,
  ResourceFactory,
  MenuService,
  LoadingSpinnerModule,
  LogDecorator,
  ZendeskWidgetFactory,
  globalVariable,
  constantModule,
  'mm.foundation'
])
  .component('navbar', navbarComponent)
  .directive('menuItem', menuItem )
  .directive('menuButton', menuButton )
  .directive('syncState', syncMenuAndState )
  .directive('plDisableLink', plDisableLink )
  .name;

export default navbarModule;
