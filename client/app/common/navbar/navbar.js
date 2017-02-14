import angular from 'angular';
import uiRouter from 'angular-ui-router';
import globalVariable from 'app/globalVariables';
import navbarComponent from './navbar.component';
import ResourceFactory from 'common/resourceFactory/resource';
import LogDecorator from 'common/logDecorator/logDecorator';
import MenuService from 'common/menuFactory/menu';
import { moveMenu, offCanvasListBugfixDef, menuItem, menuButton } from './navbar.directive';

require('angular-foundation');

let navbarModule = angular.module('navbar', [
  uiRouter,
  ResourceFactory,
  MenuService,
  LogDecorator,
  globalVariable,
  'mm.foundation'
])
  .component('navbar', navbarComponent)
  .directive('menuItem', menuItem )
  .directive('menuButton', menuButton )
  .directive('offCanvasListBugfix', offCanvasListBugfixDef )
  .directive('hasSubmenu', moveMenu )
  .directive('back', moveMenu )
  .name;

export default navbarModule;
