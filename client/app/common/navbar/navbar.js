import angular from 'angular';
import uiRouter from 'angular-ui-router';
import navbarComponent from './navbar.component';
import { offCanvasListBugfixDef } from './navbar.directive';

require('angular-foundation');

let navbarModule = angular.module('navbar', [
  uiRouter,
  'mm.foundation'
])

.component('navbar', navbarComponent)
.directive('offCanvasListBugfix', offCanvasListBugfixDef )
.name;

export default navbarModule;
