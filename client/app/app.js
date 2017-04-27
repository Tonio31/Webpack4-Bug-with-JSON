// External Module
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import 'normalize.css';
import 'angular-foundation';
import 'angular-zendesk-widget';

import 'common/fontello/css/fontello.css';
import 'c3/c3.css';

// Potentialife module
import Global from './globalVariables';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import MenuService from 'common/menuFactory/menu';
import constantModule from 'common/constants';
import ngStorage from 'ngstorage-webpack';
import LoadingSpinnerModule from 'common/loadingSpinner/loadingSpinner';


// This is a trick to be able to set up dynamic routing in run.
let $stateProviderRef = null;

let appModule = angular.module('app', [
  'mm.foundation',
  'zendeskWidget',
  uiRouter,
  ngStorage,
  ngAnimate,
  constantModule,
  Common,
  Components,
  MenuService,
  LoadingSpinnerModule,
  Global
])
  .config( ( $locationProvider,
             $logProvider,
             $stateProvider,
             $httpProvider,
             $localStorageProvider,
             $urlRouterProvider,
             ZendeskWidgetProvider,
             STATES ) => {
    'ngInject';

    // This is needed because we create our state dynamically, if we don't put this,
    // When the user refresh the page, it will go to the home page, this works with
    // $urlRouterProvider.deferIntercept(); defined in the config of this module
    // See here for more details: http://stackoverflow.com/questions/24727042/angularjs-ui-router-how-to-configure-dynamic-views
    $urlRouterProvider.deferIntercept();

    $urlRouterProvider.otherwise( ($injector, $location) => {
      let $state = $injector.get('$state');
      let intendedUrl = $location.url();
      $state.go(STATES.PAGE_NOT_FOUND, { intendedUrl: intendedUrl } );
    });

    // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    // #how-to-configure-your-server-to-work-with-html5mode
    $locationProvider.html5Mode(true).hashPrefix('!');

    $localStorageProvider.setKeyPrefix('pl2-');

    ZendeskWidgetProvider.init({
      accountUrl: 'potentialifehelp.zendesk.com',
      beforePageLoad: function(zE) {
        zE.setHelpCenterSuggestions({ url: true });
        zE.hide();
      }
    });

    // Change all HTTP GET requests to disable cache, we should always get the latest data from the server
    if ( !$httpProvider.defaults.headers.get ) {
      $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Sat, 1 Jan 2000 00:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get.Pragma = 'no-cache';

    $logProvider.debugEnabled(false);

    $stateProviderRef = $stateProvider;
  })
  // eslint-disable-next-line max-params
  .run( ( $rootScope,
          $log,
          $q,
          $timeout,
          $urlRouter,
          $stateRegistry,
          Menu,
          SpinnerFactory,
          $trace,
          $state,
          $location,
          $transitions,
          $window,
          User,
          JwtFactory,
          Data,
          STATES,
          SPINNERS ) => {
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
    //     So we need first to go to any state defined (I chose home), intercept the transition, retrieve the menu, and redirect
    //     the user to the good step
    let matchFromLoginToHome = {
      from: (state) => {
        return ( state.name === STATES.LOGIN || state.name === STATES.RESET_PASSWORD );
      },
      to: STATES.HOME
    };

    $transitions.onStart( matchFromLoginToHome, (trans) => {

      $log.log('Coming From login Page or reset password state');

      let deferred = $q.defer();

      // Find all the menu that doesn't have children (no Submenu) and create a state from it
      Menu.retrieveMenuAndReturnStates().then( (states) => {
        $log.log('Menu retrieved successfully');

        states.forEach( (state) => {
          let uiRouterState = $stateRegistry.get(state.name);

          if ( uiRouterState ) {
            // Update Old Locked state to point to courseContent component
            if ( uiRouterState.component !== state.component ) {
              $log.log(`About to deregister and re-register state ${state.name}. uiRouterState=`, uiRouterState, '  state=', state);
              $stateRegistry.deregister(state.name);
              $stateRegistry.register(state);
            }
          }
          else {
            $stateProviderRef.state(state);
          }

        });

        // This is needed because we create our state dynamically, this works with
        // $urlRouterProvider.deferIntercept(); defined in the config of this module.
        // Once we created our dynamic states, we have to make ui-router listen to route change in the URL
        // See here for more details: http://stackoverflow.com/questions/24727042/angularjs-ui-router-how-to-configure-dynamic-views
        $urlRouter.listen();

        let stateToRedirect = trans.params().forceRedirect;

        if ( stateToRedirect && stateToRedirect !== STATES.HOME && stateToRedirect !== STATES.LOGIN ) {

          // If it's a valid state, we redirect to this state, otherwise, go to 404 page
          if ( $state.href(stateToRedirect) !== null ) {
            $log.log(`Redirect to state=${stateToRedirect}   $state.href(stateToRedirect)=${$state.href(stateToRedirect)}`);
            deferred.resolve($state.target(stateToRedirect));
          }
          else {
            $log.log(`Redirect to 404 PageNotFound because stateToRedirect=${stateToRedirect}
                      $state.href(stateToRedirect)=${$state.href(stateToRedirect)}`);
            deferred.resolve($state.target(STATES.PAGE_NOT_FOUND, { intendedUrl: stateToRedirect }));
          }
        }
        else {
          $log.log(`From login to home, no redirection as we want to target ${STATES.HOME} state`);
          deferred.resolve();
        }

      },
      (error) => {
        $log.log('error Retrieving menu error=', error);
        deferred.reject();
      });

      return deferred.promise;
    });

    let matchFromInternalToAny = {
      from: (state) => {
        return ( state.name !== '' );
      }
    };
    $transitions.onStart( matchFromInternalToAny, (trans) => {
      let fromState = trans.from().name; // Example of fromState: /home
      let toState = trans.to().name; // Example of toState: /potentialife-course/cycle-1/module-1/step-2
      $log.log('$transitions.onStart - matchFromInternalToAny -  fromState=', fromState, '  toState=', toState);
      SpinnerFactory.show(SPINNERS.COURSE_CONTENT);
    });

    // On every route change, we need to update the menu in order to display the good page
    // The event we emit here is catched by the directive sync-state
    $transitions.onSuccess( {}, (trans) => {

      let fromState = trans.from().name; // Example of fromState: /home
      let toState = trans.to().name; // Example of toState: /potentialife-course/cycle-1/module-1/step-2

      SpinnerFactory.hideAll();

      $log.log('$transitions.onSuccess - fromAnyToAny - fromState=', fromState, '  toState=', toState);

      // Send the current state url to google Analytics
      $window.ga('send', 'pageview', $location.path());

      // Without $timeout, the $rootscope.on won't pick up the event because the directive is not yet created
      // see http://stackoverflow.com/questions/15676072/angularjs-broadcast-not-working-on-first-controller-load
      $timeout( () => {
        $log.info('About to emit the event: stateChangeSuccess      toState=', toState);
        $rootScope.$emit('stateChangeSuccess', toState);
      });
      return true;
    });



    // ui-router by default reports an error when we start a transition but we don't finish it and superseed it for another one
    // See comment above for more explanations on why we do this for this particular login case
    $state.defaultErrorHandler( (error) => {

      if ( error.hasOwnProperty('detail') ) {
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
      }
      else {
        $log.error(error);
      }
    });

    // Registers a OnInvalidCallback function to be invoked when StateService.transitionTo has been called with an invalid state reference parameter
    $state.onInvalid( (to, from) => {
      $log.info('Invalid transition from ', from, '  to ', to);
    });

    $log.log('Start - $location.path()=', $location.path());


    if ( $location.path() === STATES.RESET_PASSWORD ||
         $location.path().includes(STATES.SURVEY) ) {
      $log.log(`No need to retrieve User info as we target: ${$location.path()}`);
      $urlRouter.listen();
    }
    else if ( JwtFactory.isLoginInfoAvailable() ) {

      $log.log(`User Auth did NOT expired, retrieve Menu and redirect to the good state`);

      // In case the user is already logged in (token is not expired), we need to set his user ID
      // form local storage in the User factory as the id will be used to retrieve participant information
      // from server that is used on the home page and in exceptions reports to bugsnag
      let userId = JwtFactory.getUserId();
      User.setUser({ id: userId });
      Data.getParticipantDetails();

      // Set up google analytics to link the data to a specific userId
      $window.ga('set', 'userId', userId);

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
      // after he logged in (infinite loop), hence the below check
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
