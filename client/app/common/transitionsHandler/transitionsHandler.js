import angular from 'angular';
import globalVariable from 'app/globalVariables';
import UserDataFactory from 'common/userDataFactory/userData';
import ResourceFactory from 'common/resourceFactory/resource';
import LogDecorator from 'common/logDecorator/logDecorator';

// This is a trick to be able to set up dynamic routing in run.
let $stateProviderRef = null;

let transitionsHandlerModule = angular.module('transitionsHandler', [
  UserDataFactory,
  ResourceFactory,
  LogDecorator,
  globalVariable
])
.config( ($stateProvider) => {
  'ngInject';
  $stateProviderRef = $stateProvider;
})
.run( ( $log,
        $location,
        $rootScope,
        $state,
        $stateRegistry,
        $timeout,
        $trace,
        $transitions,
        $urlRouter,
        $q,
        $window,
        BugsnagUtils,
        Menu,
        SpinnerFactory,
        SPINNERS,
        STATES,
        SURVEY_360 ) => {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance( 'TransitionsHandler-RUN' );

  $log.warn('TONIO inside TransitionsHandler RUN function');

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
      return (state.name === STATES.LOGIN || state.name === STATES.RESET_PASSWORD || state.name === STATES.CREATION_PASSWORD);
    },
    to: STATES.HOME
  };

  $transitions.onStart( matchFromLoginToHome, ( trans ) => {

    $log.log( 'Coming From login Page or reset/create password state' );

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


  let matchFromAnyToParentNoMenu = {
    to: ( state ) => {
      return (state.parent.name === STATES.MAIN_NO_MENU ||
        state.parent.name === STATES.LOGIN_ROOT);
    }
  };
  $transitions.onError( matchFromAnyToParentNoMenu, ( trans ) => {
    let fromState = trans.from().name; // Example of fromState: /home
    let toState = trans.to().name; // Example of toState: /login
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
    else if ( error.type === 6 && error.detail.status === 401 &&
      (error.detail.statusText === SURVEY_360.ERROR_TOKEN_ALREADY_USED ||
        error.detail.statusText === SURVEY_360.ERROR_NO_TOKEN_IN_URL) ) {
      $log.warn( `$transitions.onError(matchFromAnyToParentNoMenu) - Error 401, ${error.detail.statusText}. 
                    It is probably the 360 survey token used a second time` );
      $state.go( STATES.ERROR_PAGE_NO_MENU, {
        errorMsg: '360_TOKEN_USED',
        bugsnagErrorName: error.detail.statusText,
        bugsnagMetaData: {
          'Error Message': error.message,
          'Error Type': error.type,
          'Error Status': error.detail.status,
          'Error StatusText': error.detail.statusText,
          'From State': fromState,
          'To State': toState
        }
      }, { reload: true } );
    }
    else if ( error.type === 6 && error.detail.status === 503 ) {
      $log.error( '$transitions.onError(matchFromAnyToParentWithMenu) - fromState=', fromState,
        '  toState=', toState, '  error=', error );
      $state.go( STATES.ERROR_PAGE_NO_MENU, {
        errorMsg: 'DOWN_FOR_MAINTENANCE',
        bugsnagErrorName: 'Website is in Maintenance Mode',
      }, { reload: true } );
    }
    else {
      $log.error( '$transitions.onError(matchFromAnyToParentNoMenu) - fromState=', fromState,
        '  toState=', toState, '  error=', error );
      $state.go( STATES.ERROR_PAGE_NO_MENU, {
        errorMsg: 'ERROR_UNEXPECTED',
        bugsnagErrorName: 'Error Transition not logged in',
        bugsnagMetaData: {
          'Error Message': error.message,
          'Error Type': error.type,
          'Error Status': error.detail.status,
          'Error StatusText': error.detail.statusText,
          'From State': fromState,
          'To State': toState
        }
      }, { reload: true } );
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

      let errorMsg = 'AUTH_ERROR';

      if ( error.detail.statusText === 'token_expired' ) {
        errorMsg = 'LOGIN_TOKEN_EXPIRED';
      }

      let params = {
        stateToRedirect: toState,
        displayErrorOnInit: errorMsg
      };
      $state.go( STATES.LOGIN, params, { reload: true } );
    }
    else if ( error.type === 6 && error.detail.status === 503 ) {
      $log.error( '$transitions.onError(matchFromAnyToParentWithMenu) - fromState=', fromState,
        '  toState=', toState, '  error=', error );
      $state.go( STATES.ERROR_PAGE, {
        errorMsg: 'DOWN_FOR_MAINTENANCE',
        bugsnagErrorName: 'Website is in Maintenance Mode',
      }, { reload: true } );
    }
    else {
      $log.error( '$transitions.onError(matchFromAnyToParentWithMenu) - fromState=', fromState,
        '  toState=', toState, '  error=', error );
      $state.go( STATES.ERROR_PAGE, {
        errorMsg: 'ERROR_UNEXPECTED',
        bugsnagErrorName: 'Error Transition logged in',
        bugsnagMetaData: {
          'Error Message': error.message,
          'Error Type': error.type,
          'Error Status': error.detail.status,
          'Error StatusText': error.detail.statusText,
          'From State': fromState,
          'To State': toState
        }
      }, { reload: true } );
    }
  } );


  // Registers a OnInvalidCallback function to be invoked when StateService.transitionTo has been called with an invalid state reference parameter
  $state.onInvalid( ( to, from ) => {
    $log.info( 'Invalid transition from ', from, '  to ', to );
  } );

  return;
})

.name;

export default transitionsHandlerModule;
