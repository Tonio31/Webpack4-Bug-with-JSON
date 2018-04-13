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
  $httpProvider.defaults.headers.get[ 'If-Modified-Since' ] = 'Sat, 1 Jan 2000 00:00:00 GMT';
  $httpProvider.defaults.headers.get[ 'Cache-Control' ] = 'no-cache';
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
.run( ( $log,
        $urlRouter,
        $exceptionHandler,
        Menu,
        $state,
        $location,
        $window,
        User,
        ZendeskWidget,
        JwtFactory,
        Data,
        STATES,
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

    $log.log( 'Start - $location.path()=', $location.path() );

    Data.isMaintenanceDisabled().then( () => {
      $log.log( 'Maintenance Mode is DISABLED' );

      if ( $location.path() === STATES.RESET_PASSWORD ||
        $location.path() === STATES.CREATION_PASSWORD ||
        $location.path() === STATES.RETRIEVE_CREDENTIALS ||
        $location.path().includes( STATES.SURVEY ) ) {
        $log.log( `No need to retrieve User info as we target: ${$location.path()}` );
        $urlRouter.sync();
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
              $state.go( STATES.ERROR_PAGE, {
                errorMsg: 'ERROR_UNEXPECTED',
                bugsnagErrorName: 'Error processing Menu',
                bugsnagMetaData: {
                  'Error Message': error.data.message,
                  'Error Type': error.type,
                  'Error Status': error.status,
                  'Error StatusText': error.statusText
                }
              } );
            }
          },
          ( error ) => {
            $log.error( 'error Retrieving menu' );

            if ( !JwtFactory.isAuthOrMaintenanceError( error ) ) {
              $state.go( STATES.ERROR_PAGE, {
                errorMsg: 'ERROR_UNEXPECTED',
                bugsnagErrorName: 'Error retrieving Menu',
                bugsnagMetaData: {
                  'Error Message': error.data.message,
                  'Error Type': error.type,
                  'Error Status': error.status,
                  'Error StatusText': error.statusText
                }
              } );
            }

          });
        },
        ( error ) => {
          $log.error( 'error Retrieving Participant Data' );

          if ( !JwtFactory.isAuthOrMaintenanceError( error ) ) {
            $state.go( STATES.ERROR_PAGE, {
              errorMsg: 'ERROR_UNEXPECTED',
              bugsnagErrorName: 'Error retrieving Participant Data',
              bugsnagMetaData: {
                'Error Message': error.data.message,
                'Error Type': error.type,
                'Error Status': error.status,
                'Error StatusText': error.statusText
              }
            } );
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

    });

  }
  catch (error) {
    $state.go( STATES.ERROR_PAGE_NO_MENU, {
      errorMsg: 'ERROR_UNEXPECTED',
      bugsnagErrorName: 'Error APP::RUN()',
      bugsnagMetaData: {
        'Error Message': error,
      }
    } );
  }
} )
.component( 'app', AppComponent )
.name;

export default appModule;
