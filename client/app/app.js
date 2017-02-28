// External Module
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'normalize.css';
import 'angular-foundation';

import 'common/fontello/css/fontello.css';

import 'c3/c3.css';
import 'c3-angular';

// Potentialife module
import Global from './globalVariables';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import NavBarComponent from 'common/navbar/navbar';
import MenuService from 'common/menuFactory/menu';


// This is a trick to be able to set up dynamic routing in run.
let $stateProviderRef = null;

let appModule = angular.module('app', [
  'mm.foundation',
  'gridshore.c3js.chart',
  uiRouter,
  Common,
  Components,
  NavBarComponent,
  MenuService,
  Global
])
  .config(($locationProvider, $stateProvider, $urlRouterProvider) => {
    'ngInject';

    // This is needed because we create our state dynamically, if we don't put this,
    // When the user refresh the page, it will go to the home page, this works with
    // $urlRouterProvider.deferIntercept(); defined in the config of this module
    // See here for more details: http://stackoverflow.com/questions/24727042/angularjs-ui-router-how-to-configure-dynamic-views
    $urlRouterProvider.deferIntercept();

    // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    // #how-to-configure-your-server-to-work-with-html5mode
    $locationProvider.html5Mode(true).hashPrefix('!');

    $stateProviderRef = $stateProvider;
  })
  .run( ($log, $urlRouter, Menu) => {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance('app::RUN()');
    $log.log('Start');

    let states = [];

    // Find all the menu that doesn't have children (no Submenu) and create a state from it
    let findFinalState = function( iMenu ) {

      if ( iMenu.hasOwnProperty('children') ) {
        for ( let child of iMenu.children ) {
          findFinalState(child);
        }
      }
      else {
        let state = {
          name: iMenu.fullUrl,
          url: iMenu.fullUrl,
          component: 'courseContent',
          resolve: {
            content: (Data) => {
              'ngInject';
              return Data.getCourseContent(iMenu.fullUrl);
            }
          }
        };

        states.push(state);
      }
    };

    Menu.getMenuPromise().then( (menuData) => {
      $log.log('Menu retrieved successfully');

      findFinalState(menuData);

      states.forEach( (state) => {
        $stateProviderRef.state(state);
      });

      // This is needed because we create our state dynamically, if we don't put this,
      // When the user refresh the page, it will go to the home page, this works with
      // $urlRouterProvider.deferIntercept(); defined in the config of this module
      // See here for more details: http://stackoverflow.com/questions/24727042/angularjs-ui-router-how-to-configure-dynamic-views
      $urlRouter.sync();
      $urlRouter.listen();
    },
    (error) => {
      $log.log('app::RUN - error Retrieving menu menuData=', error);
    });

    $log.log('app::RUN - END');
  })
  .component('app', AppComponent)
  .name;

export default appModule;
