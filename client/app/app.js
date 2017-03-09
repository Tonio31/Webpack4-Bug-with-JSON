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
  .config(($locationProvider, $stateProvider, $urlRouterProvider, STATES) => {
    'ngInject';

    // This is needed because we create our state dynamically, if we don't put this,
    // When the user refresh the page, it will go to the home page, this works with
    // $urlRouterProvider.deferIntercept(); defined in the config of this module
    // See here for more details: http://stackoverflow.com/questions/24727042/angularjs-ui-router-how-to-configure-dynamic-views
    $urlRouterProvider.deferIntercept();

    $urlRouterProvider.otherwise(STATES.PAGE_NOT_FOUND);

    // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    // #how-to-configure-your-server-to-work-with-html5mode
    $locationProvider.html5Mode(true).hashPrefix('!');

    $stateProviderRef = $stateProvider;
  })
  // eslint-disable-next-line max-params
  .run( ( $log,
          $urlRouter,
          Menu,
          $trace,
          $state,
          $location,
          $transitions,
          User,
          JwtFactory,
          Data,
          STATES ) => {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance('app::RUN()');

    // Activate logging of transitions in console
    $trace.enable('TRANSITION');

    // If we're coming from the login page to the home page, it could be for 2 reason:
    //  1) We wanted to access the home page but got redirected to the login page
    //  2) We wanted to access any other page than the home but got redirected to the home page
    //     In this case, we are forced to redirect first to the home page because if it's the first time we access the website
    //     the menu is not yet retrieved (we need to be logged in to retrieve the menu), so all the states are not defined
    //     So we need first to go to any state defined (I choose home), intercept the transition, retrieve the menu, and redirect
    //     the user to the good step

    let matchFromLoginToHome = {
      from: STATES.LOGIN,
      to: STATES.HOME
    };

    $transitions.onStart( matchFromLoginToHome, (trans) => {

      $log.log('Im coming from login Page');

      // Find all the menu that doesn't have children (no Submenu) and create a state from it
      Menu.retrieveMenuAndReturnStates().then( (states) => {
        $log.log('Menu retrieved successfully');

        states.forEach( (state) => {
          $stateProviderRef.state(state);
        });

        // This is needed because we create our state dynamically, this works with
        // $urlRouterProvider.deferIntercept(); defined in the config of this module.
        // Once we created our dynamic states, we have to make ui-router listen to route change in the URL
        // See here for more details: http://stackoverflow.com/questions/24727042/angularjs-ui-router-how-to-configure-dynamic-views
        $urlRouter.listen();

        let stateToRedirect = trans.params().forceRedirect;

        if ( stateToRedirect !== STATES.HOME && stateToRedirect !== STATES.LOGIN ) {

          // If it's a valid state, we redirect to this state, otherwise, go to 404 page
          if ( $state.href(stateToRedirect) !== null ) {
            $log.log(`Redirect to state=${stateToRedirect}   $state.href(stateToRedirect)=${$state.href(stateToRedirect)}`);
            $state.go(stateToRedirect);
          }
          else {
            $log.log(`Redirect to 404 PageNotFound because stateToRedirect=${stateToRedirect}   
                      $state.href(stateToRedirect)=${$state.href(stateToRedirect)}`);
            $state.go(STATES.PAGE_NOT_FOUND);
          }
        }
        else {
          $log.log(`From login to home, no redirection as we want to target ${STATES.HOME} state`);
        }

      },
      (error) => {
        $log.log('error Retrieving menu error=', error);
      });


      return true;
    });


    // ui-router by default reports an error when we start a transition but we don't finish it and superseed it for another one
    // See comment above for more explanations on why we do this for this particular login case
    $state.defaultErrorHandler( (error) => {
      let fromState = error.detail.from();
      let toState = error.detail.to();

      if ( ( fromState.name === STATES.LOGIN || toState.name === STATES.LOGIN ) &&
        error.message === 'The transition has been superseded by a different transition' ) {
        $log.log('Transition from login to another page has been superseded, this is normal as part of login process');
        $log.log(error);
      }
      else {
        $log.error(error);
      }
    });


    $log.log('Start');


    if ( !JwtFactory.isAuthedExpired() ) {

      User.setUser({ id: JwtFactory.getUserId() });
      Data.getParticipantDetails();

      Menu.retrieveMenuAndReturnStates().then( (states) => {
        $log.log('Menu retrieved successfully');

        states.forEach( (state) => {
          $stateProviderRef.state(state);
        });

        // Will trigger an update; the same update that happens when the address bar url changes, aka $locationChangeSuccess.
        $urlRouter.sync();

        // This is needed because we create our state dynamically, this works with
        // $urlRouterProvider.deferIntercept(); defined in the config of this module.
        // Once we created our dynamic states, we have to make ui-router listen to route change in the URL
        // See here for more details: http://stackoverflow.com/questions/24727042/angularjs-ui-router-how-to-configure-dynamic-views
        $urlRouter.listen();
      },
      (error) => {
        $log.log('error Retrieving menu error=', error);
      });
    }
    else {

      // If the user access the URL login ('/login'), we should not redirect him to the login page
      // after (infinite loop), hence the below check
      let firstStateRequested = STATES.HOME;
      if ( $location.url() !== $state.get(STATES.HOME).url &&
           $location.url() !== $state.get(STATES.LOGIN).url ) {
        firstStateRequested = $location.url();
      }

      $log.log(`User Auth expired, go to login, stateToRedirect=${firstStateRequested}`);
      $state.go(STATES.LOGIN, { stateToRedirect: firstStateRequested });
    }

    $log.log('END');
  })
  .component('app', AppComponent)
  .name;

export default appModule;
