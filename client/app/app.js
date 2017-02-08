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
import MenuService from 'common/menuService/menu';
import ResourceFactory from 'common/resourceService/resource';


//This is a trick to be able to set up dynamic routing in run.
var $stateProviderRef = null;

let appModule = angular.module('app', [
    'mm.foundation',
    uiRouter,
    Common,
    Components,
    MenuService,
    ResourceFactory,
    Global
  ])
  .config(($locationProvider, $stateProvider) => {
    "ngInject";
    // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    // #how-to-configure-your-server-to-work-with-html5mode
    $locationProvider.html5Mode(true).hashPrefix('!');

    console.log("TONIO assigning $stateProviderRef");
    $stateProviderRef = $stateProvider;
  })
  .constant('MENU_KEYS', {
    'CHILDREN': 'children',
    'SLUG': 'slug'
  })
  .run( (Data, Menu, MENU_KEYS) => {
    "ngInject";

    let states = [];

    let findFinalState = function ( iMenu, iCurrentUrl ) {
      //console.log("findFinalState iCurrentUrl=", iCurrentUrl, "   iMenu=", iMenu);
      let url = iCurrentUrl + '/' + iMenu[MENU_KEYS.SLUG];

      if ( iMenu.hasOwnProperty(MENU_KEYS.CHILDREN) ) {
        for( let child of iMenu[MENU_KEYS.CHILDREN] ) {
          //console.log("child.title=", child.title);
          findFinalState(child, url);
        }
      }
      else {
        let state = {
          name: url,
          url: url,
          component: 'courseContent',
          resolve: {
            data: () => ({
              name: url,
              title: iMenu.title
            }),
            content: (Data) => {
              "ngInject";
              return Data.getCourseContent(url);
            }
          }
        };

        states.push(state);
      }
    };





    let menu = Menu.getMenuPromise().then( (menuData) => {
      console.log("APP::RUN menu Retrieved successfully menuData=", menuData);
      let url = '';
      findFinalState(menuData, url);
      //console.log("states=", states);

      states.forEach(function(state) {
        //console.log("state=", state);
        $stateProviderRef.state(state);
      });


    },
    (error) => {
      console.log("APP::RUN   error Retrieving menu menuData=", error);

    });


  })
  //.run(AppRouting($stateProviderRef))
  .component('app', AppComponent)
  .name;

export default appModule;
