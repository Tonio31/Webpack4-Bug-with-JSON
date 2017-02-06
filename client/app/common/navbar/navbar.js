import angular from 'angular';
import uiRouter from 'angular-ui-router';
import globalVariable from '../../globalVariables';
import navbarComponent from './navbar.component';
import ResourceFactory from '../resourceService/resource';
import UserData from '../userDataFactory/userData';
require('quick-ng-repeat/quick-ng-repeat');
import { itemTest, offCanvasListBugfixDef, menuItem } from './navbar.directive';

require('angular-foundation');

let navbarModule = angular.module('navbar', [
  uiRouter,
  ResourceFactory,
  UserData,
  globalVariable,
  'QuickList',
  'mm.foundation'
])

.component('navbar', navbarComponent)
.directive('menuItem', menuItem )
.directive('offCanvasListBugfix', offCanvasListBugfixDef )
.directive('hasSubmenu', itemTest )
.directive('back', itemTest )
.name;

export default navbarModule;
