// External Module
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ngAnimate from 'angular-animate';
import 'normalize.css';
import 'angular-foundation';

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

let appModule = angular.module( 'app', [
  'mm.foundation',
  uiRouter,
  ngStorage,
  ngAnimate,
  constantModule,
  Common,
  Components,
  MenuService,
  LoadingSpinnerModule,
  Global
] )
.config( ( $locationProvider,
           $stateProvider,
           $httpProvider,
           $qProvider,
           $localStorageProvider,
           $urlRouterProvider,
           $sceDelegateProvider,
           WEBSITE_CONFIG,
           STATES ) => {
  'ngInject';

  // This is needed because we create our state dynamically, if we don't put this,
  // When the user refresh the page, it will go to the home page, this works with
  // $urlRouterProvider.deferIntercept(); defined in the config of this module
  // See here for more details: http://stackoverflow.com/questions/24727042/angularjs-ui-router-how-to-configure-dynamic-views
  $urlRouterProvider.deferIntercept();

  $urlRouterProvider.otherwise( ( $injector, $location ) => {
    let $state = $injector.get( '$state' );
    let intendedUrl = $location.url();
    $state.go( STATES.PAGE_NOT_FOUND, { intendedUrl: intendedUrl } );
  } );

  // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
  // #how-to-configure-your-server-to-work-with-html5mode
  $locationProvider.html5Mode( true ).hashPrefix( '!' );

  $localStorageProvider.setKeyPrefix( 'pl2-' );

  // Change all HTTP GET requests to disable cache, we should always get the latest data from the server
  if ( !$httpProvider.defaults.headers.get ) {
    $httpProvider.defaults.headers.get = {};
  }
  $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Sat, 1 Jan 2000 00:00:00 GMT';
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get.Pragma = 'no-cache';

  $qProvider.errorOnUnhandledRejections( false );

  $stateProviderRef = $stateProvider;

  // The login page of this website can log user in 2 other different website, we need to whitelist the other website
  // in order to submit the hidden form (name="goToOtherPlWebsites") that allows login on the other website
  $sceDelegateProvider.resourceUrlWhitelist( [
    WEBSITE_CONFIG.OTHER_PL_SITES_API.change.loginUrl,
    WEBSITE_CONFIG.OTHER_PL_SITES_API.my.loginUrl
  ] );
} )
.run( ( $rootScope,
        $log,
        $q,
        $timeout,
        $urlRouter,
        $stateRegistry,
        $exceptionHandler,
        Menu,
        SpinnerFactory,
        BugsnagUtils,
        $trace,
        $state,
        $location,
        $transitions,
        $window,
        User,
        ZendeskWidget,
        JwtFactory,
        Data,
        STATES,
        SPINNERS,
        WEBSITE_CONFIG ) => {
  'ngInject';

  try {

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'app::RUN()' );

    // Init the Zendesk Widget and hide it until user is defined
    ZendeskWidget.init();
    ZendeskWidget.hide();

    // Create Google Analytics Session
    $window.ga( 'create', WEBSITE_CONFIG.googleTrackingCode, 'auto' );

    // Activate logging of transitions in console
    $trace.enable( 'TRANSITION' );

    // If we're coming from the login page to the home page, it could be for 2 reason:
    //  1) We wanted to access the home page but got redirected to the login page
    //  2) We wanted to access any other page than the home but got redirected to the home page
    //     In this case, we are forced to redirect first to the home page because if it's the first time we access the website
    //     the menu is not yet retrieved (we need to be logged in to retrieve the menu), so all the states are not defined
    //     So we need first to go to any state defined (I chose home), intercept the transition, retrieve the menu, and redirect
    //     the user to the good step
    let matchFromLoginToHome = {
      from: ( state ) => {
        return (state.name === STATES.LOGIN || state.name === STATES.RESET_PASSWORD);
      },
      to: STATES.HOME
    };

    $transitions.onStart( matchFromLoginToHome, ( trans ) => {

      $log.log( 'Coming From login Page or reset password state' );

      let deferred = $q.defer();

      // Find all the menu that doesn't have children (no Submenu) and create a state from it
      Menu.retrieveMenuAndReturnStates().then( ( states ) => {
        $log.log( 'Menu retrieved successfully' );

        states.forEach( ( state ) => {
          let uiRouterState = $stateRegistry.get( state.name );

          if ( uiRouterState ) {
            // Update Old Locked state to point to courseContent component
            if ( uiRouterState.component !== state.component ) {
              $log.log( `About to deregister and re-register state ${state.name}. uiRouterState=`, uiRouterState, '  state=', state );
              $stateRegistry.deregister( state.name );
              $stateRegistry.register( state );
            }
          }
          else {
            $stateProviderRef.state( state );
          }

        } );

        // This is needed because we create our state dynamically, this works with
        // $urlRouterProvider.deferIntercept(); defined in the config of this module.
        // Once we created our dynamic states, we have to make ui-router listen to route change in the URL
        // See here for more details: http://stackoverflow.com/questions/24727042/angularjs-ui-router-how-to-configure-dynamic-views
        $urlRouter.listen();

        let stateToRedirect = trans.params().forceRedirect;

        if ( stateToRedirect && stateToRedirect !== STATES.HOME && stateToRedirect !== STATES.LOGIN ) {

          // If it's a valid state, we redirect to this state, otherwise, go to 404 page
          if ( $state.href( stateToRedirect ) !== null ) {
            $log.log( `Redirect to state=${stateToRedirect}   $state.href(stateToRedirect)=${$state.href( stateToRedirect )}` );
            deferred.resolve( $state.target( stateToRedirect ) );
          }
          else {
            $log.log( `Redirect to 404 PageNotFound because stateToRedirect=${stateToRedirect}
                    $state.href(stateToRedirect)=${$state.href( stateToRedirect )}` );
            deferred.resolve( $state.target( STATES.PAGE_NOT_FOUND, { intendedUrl: stateToRedirect } ) );
          }
        }
        else {
          $log.log( `From login to home, no redirection as we want to target ${STATES.HOME} state` );
          deferred.resolve();
        }

      },
      ( error ) => {
        $log.log( 'error Retrieving menu error=', error );
        deferred.reject();
      } );

      return deferred.promise;
    } );

    let matchFromInternalToAny = {
      from: ( state ) => {
        return (state.name !== '');
      }
    };
    $transitions.onStart( matchFromInternalToAny, ( trans ) => {
      let fromState = trans.from().name; // Example of fromState: /home
      let toState = trans.to().name; // Example of toState: /potentialife-course/cycle-1/module-1/step-2
      $log.log( '$transitions.onStart - matchFromInternalToAny -  fromState=', fromState, '  toState=', toState );
      SpinnerFactory.show( SPINNERS.COURSE_CONTENT );
    } );

    // On every route change, we need to update the menu in order to display the good page
    // The event we emit here is catched by the directive sync-state
    $transitions.onSuccess( {}, ( trans ) => {

      let fromState = trans.from().name; // Example of fromState: /home
      let toState = trans.to().name; // Example of toState: /potentialife-course/cycle-1/module-1/step-2

      SpinnerFactory.hideAll();

      $log.log( '$transitions.onSuccess - fromAnyToAny - fromState=', fromState, '  toState=', toState );

      // Send the current state url to google Analytics
      $window.ga( 'send', 'pageview', $location.path() );

      // Without $timeout, the $rootscope.on won't pick up the event because the directive is not yet created
      // see http://stackoverflow.com/questions/15676072/angularjs-broadcast-not-working-on-first-controller-load
      $timeout( () => {
        $log.info( 'About to emit the event: stateChangeSuccess      toState=', toState );
        $rootScope.$emit( 'stateChangeSuccess', toState );
        BugsnagUtils.addStateForHistory( toState );
      } );

      return true;
    } );


    let matchFromAnyToParentNoLogin = {
      to: ( state ) => {
        return (state.parent.name === STATES.MAIN_NO_MENU ||
          state.parent.name === STATES.LOGIN_ROOT);
      }
    };
    $transitions.onError( matchFromAnyToParentNoLogin, ( trans ) => {
      let fromState = trans.from().name; // Example of fromState: /home
      let toState = trans.to().name; // Example of toState: /potentialife-course/cycle-1/module-1/step-2
      let error = trans.error();

      if ( error.type === 6 && error.detail.status === 401 && error.detail.statusText === 'token_used' ) {
        $log.warn( `$transitions.onError(matchFromAnyToParentNoLogin) - Error 401, token_used. It is probably the 360 survey
                     token used a second time` );
        $state.go( STATES.ERROR_PAGE_NO_MENU, { errorMsg: '360_TOKEN_USED' }, { reload: true } );
      }
      else {
        $log.error( '$transitions.onError(matchFromAnyToParentNoLogin) - fromState=', fromState,
          '  toState=', toState, '  error=', error );
        $state.go( STATES.ERROR_PAGE_NO_MENU, { errorMsg: 'ERROR_UNEXPECTED' }, { reload: true } );
      }
    } );


    let matchFromAnyToParentWithMenu = {
      to: ( state ) => {
        return (state.parent.name === STATES.MAIN);
      }
    };
    $transitions.onError( matchFromAnyToParentWithMenu, ( trans ) => {
      let fromState = trans.from().name; // Example of fromState: /home
      let toState = trans.to().name; // Example of toState: /potentialife-course/cycle-1/module-1/step-2
      let error = trans.error();

      // error types:  SUPERSEDED = 2, ABORTED = 3, INVALID = 4, IGNORED = 5, ERROR = 6
      // https://github.com/ui-router/core/blob/0b1e9ed/src/transition/rejectFactory.ts#L18
      if ( error.type === 5 ||
        error.type === 2 ) {
        // SUPERSEDED
        // This error will be normal after the login if the user is redirected to another page than home
        // or if the user clicks super fast on menu items, then we won't have time to load one step before the user request another one.
        //
        // IGNORED
        // For instance if the user clicks twice on a menu link super fast or twice on the home page link super fast, he will get here
        // We don't want to throw an error here as an ignored transition should just be ignored
        $log.log( 'Transition from anything to another page has failed because error=', error );
      }
      else if ( error.type === 6 && error.detail.status === 401 ) {
        $log.warn( `$transitions.onError(matchFromAnyToParentWithMenu) - Error 401, user not authenticated or token expired, 
                    redirect to login page.  stateToRedirect=`, toState );
        let params = {
          stateToRedirect: toState,
          displayErrorOnInit: 'LOGIN_TOKEN_EXPIRED'
        };
        $state.go( STATES.LOGIN, params, { reload: true } );
      }
      else {
        $log.error( '$transitions.onError(matchFromAnyToParentWithMenu) - fromState=', fromState,
          '  toState=', toState, '  error=', error );
        $state.go( STATES.ERROR_PAGE, { errorMsg: 'ERROR_UNEXPECTED' }, { reload: true } );
      }
    } );


    // Registers a OnInvalidCallback function to be invoked when StateService.transitionTo has been called with an invalid state reference parameter
    $state.onInvalid( ( to, from ) => {
      $log.info( 'Invalid transition from ', from, '  to ', to );
    } );


    $log.log( 'Start - $location.path()=', $location.path() );

    if ( $location.path() === STATES.RESET_PASSWORD ||
      $location.path() === STATES.RETRIEVE_CREDENTIALS ||
      $location.path().includes( STATES.SURVEY ) ) {
      $log.log( `No need to retrieve User info as we target: ${$location.path()}` );
      $urlRouter.listen();
    }
    else if ( JwtFactory.isLoginInfoAvailable() ) {

      $log.log( `User Auth did NOT expired, retrieve Menu and redirect to the good state` );

      // In case the user is already logged in (token is not expired), we need to set his user ID
      // form local storage in the User factory as the id will be used to retrieve participant information
      // from server that is used on the home page and in exceptions reports to bugsnag
      let userId = JwtFactory.getUserId();
      User.setUser( { id: userId } );
      Data.getParticipantDetails().then( () => {
        $log.log( 'Participant details retrieved successfully' );
        Menu.retrieveMenuAndReturnStates().then( ( states ) => {
          try {
            $log.log( 'Menu retrieved successfully' );

            states.forEach( ( state ) => {
              $stateProviderRef.state( state );
            } );

            // Will trigger an update; the same update that happens when the address bar url changes, aka $locationChangeSuccess.
            $urlRouter.sync();

            // This is needed because we create our state dynamically, this works with
            // $urlRouterProvider.deferIntercept(); defined in the config of this module.
            // Once we created our dynamic states, we have to make ui-router listen to route change in the URL
            // See here for more details: http://stackoverflow.com/questions/24727042/angularjs-ui-router-how-to-configure-dynamic-views
            $urlRouter.listen();
          }
          catch (error) {

            if ( JwtFactory.isAuthError( error ) ) {
              $state.go( STATES.LOGIN, {
                displayErrorOnInit: 'AUTH_ERROR'
              } );
            }
            else {
              $exceptionHandler( error );
              $state.go( STATES.ERROR_PAGE, { errorMsg: 'ERROR_UNEXPECTED' } );
            }
          }

        },
        ( error ) => {
          $log.error( 'error Retrieving menu' );

          if ( JwtFactory.isAuthError( error ) ) {
            $state.go( STATES.LOGIN, {
              displayErrorOnInit: 'AUTH_ERROR'
            } );
          }
          else {
            $exceptionHandler( error );
            $state.go( STATES.ERROR_PAGE, { errorMsg: 'ERROR_UNEXPECTED' } );
          }

        } );
      },
      ( error ) => {
        $log.error( 'error Retrieving Participant Data' );

        if ( JwtFactory.isAuthError( error ) ) {
          $state.go( STATES.LOGIN, {
            displayErrorOnInit: 'AUTH_ERROR'
          } );
        }
        else {
          $exceptionHandler( error );
          $state.go( STATES.ERROR_PAGE, { errorMsg: 'ERROR_UNEXPECTED' } );
        }

      } );
    }
    else {
      // If the user access the URL login ('/login'), we should not redirect him to the login page
      // after he logged in (infinite loop), hence the below check
      let firstStateRequested = STATES.HOME;
      if ( $location.path() !== $state.get( STATES.HOME ).url &&
        $location.path() !== $state.get( STATES.LOGIN ).url &&
        $location.path() !== $state.get( STATES.ERROR_PAGE ).url &&
        $location.path() !== $state.get( STATES.ERROR_PAGE_NO_MENU ).url ) {
        firstStateRequested = $location.path();
      }

      $log.log( `User Auth expired, go to login, stateToRedirect=${firstStateRequested}, $location.path()=${$location.path()}` );
      $state.go( STATES.LOGIN, {
        stateToRedirect: firstStateRequested,
        target: $location.search().target,
        username: $location.search().username,
        pwd: $location.search().pwd
      } );
    }
    $log.log( 'END' );
  }
  catch (error) {
    $exceptionHandler( error );
    $state.go( STATES.ERROR_PAGE_NO_MENU, { errorMsg: 'ERROR_UNEXPECTED' } );
  }
} )
.component( 'app', AppComponent )
  .name;

export default appModule;
