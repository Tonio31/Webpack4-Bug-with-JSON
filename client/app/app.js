//External Module
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'normalize.css';
require('angular-foundation');

//Potentialife module
import Global from './globalVariables';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import NavBarComponent  from 'common/navbar/navbar';
import MenuService from 'common/menuService/menu';


//This is a trick to be able to set up dynamic routing in run.
var $stateProviderRef = null;

let appModule = angular.module('app', [
    'mm.foundation',
    uiRouter,
    Common,
    Components,
    NavBarComponent,
    MenuService,
    Global
  ])
  .config(($locationProvider, $stateProvider) => {
    "ngInject";
    // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    // #how-to-configure-your-server-to-work-with-html5mode
    $locationProvider.html5Mode(true).hashPrefix('!');

    $stateProviderRef = $stateProvider;
  })
  .run( ($log, Menu) => {
    "ngInject";
    $log.log("app::RUN()");

    let states = [];

    //Find all the menu that doesn't have children (no Submenu) and create a state from it
    let findFinalState = function ( iMenu ) {

      if ( iMenu.hasOwnProperty('children') ) {
        for( let child of iMenu.children ) {
          findFinalState(child);
        }
      }
      else {
        let state = {
          name: iMenu.fullUrl,
          url: iMenu.fullUrl,
          component: 'courseContent',
          resolve: {
            data: () => ({
              name: iMenu.fullUrl,
              title: iMenu.title
            }),
            content: (Data) => {
              "ngInject";
              return Data.getCourseContent(iMenu.fullUrl);
            }
          }
        };

        states.push(state);
      }
    };

    Menu.getMenuPromise().then( (menuData) => {
      $log.log("app::RUN - menu retrieved successfully menuData=", menuData);

      findFinalState(menuData);
      $log.log("app::RUN states=", states);

      states.forEach(function(state) {
        $stateProviderRef.state(state);
      });
    },
    (error) => {
      $log.log("app::RUN - error Retrieving menu menuData=", error);
    });

    $log.log("app::RUN - END");
  })
  .component('app', AppComponent)
  .name;

export default appModule;
