import angular from 'angular';
import uiRouter from 'angular-ui-router';
import globalVariable from 'app/globalVariables';
import navbarComponent from './navbar.component';
import ResourceFactory from 'common/resourceService/resource';
import MenuService from 'common/menuService/menu';
import { moveMenu, offCanvasListBugfixDef, menuItem } from './navbar.directive';

require('angular-foundation');

let navbarModule = angular.module('navbar', [
  uiRouter,
  ResourceFactory,
  MenuService,
  globalVariable,
  'mm.foundation'
])
  .component('navbar', navbarComponent)
  .directive('menuItem', menuItem )
  .directive('offCanvasListBugfix', offCanvasListBugfixDef )
  .directive('hasSubmenu', moveMenu )
  .directive('back', moveMenu )
  .name;

export default navbarModule;
