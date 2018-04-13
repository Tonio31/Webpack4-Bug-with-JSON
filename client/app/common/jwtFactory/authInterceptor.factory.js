/* eslint-disable camelcase */

let AuthInterceptorFactory = function( $log,
                                       $state,
                                       $q,
                                       JwtFactory,
                                       STATES,
                                       WEBSITE_CONFIG ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('AuthInterceptorFactory');

  // automatically attach Authorization header
  let request = (config) => {

    // Only add headers for
    if ( config.url.includes(WEBSITE_CONFIG.apiUrl) ) {
      let token = JwtFactory.getToken();
      let userId = JwtFactory.getUserId();
      if ( token ) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if ( userId ) {
        config.headers.user_id = userId;
      }
    }

    return config;
  };

  // If a token was sent back, save it
  let response = (res) => {
    $log.log('There was an NO error during the last communication with the server res=', res);
    if ( res.hasOwnProperty('data') ) {
      if ( res.data.hasOwnProperty('token') ) {
        JwtFactory.saveToken(res.data.token);
      }
    }

    return res;
  };

  let responseError = (error) => {

    $log.log('There was an error during the last communication with the server error.status=', error.status);

    $log.error('error=', angular.toJson(error));

    let url = '';
    if ( error.hasOwnProperty('config') && error.config.hasOwnProperty('url') ) {
      url = error.config.url;
    }

    if ( url.includes('step') || url.includes('survey') || url.includes('reflexion') ) {
      // As the step & survey endpoint are called during a transition (resolve of state), if we change here, it will be overridden
      // by transitionsHandler::$transitions.onError( matchFromAnyToParentWithMenu )
      return $q.reject(error);
    }


    if ( error.status === 503 ) {
      // Site is down for maintenance
      $state.go( STATES.ERROR_PAGE_NO_MENU, {
        errorMsg: 'DOWN_FOR_MAINTENANCE',
        bugsnagErrorName: 'Website is in Maintenance Mode',
      } );
    }
    else if ( error.status === 401 && !url.includes('authenticate') ) {
      $log.log('error.status=401, redirect to login page');

      let errorMsg = 'AUTH_ERROR';

      if ( error.statusText === 'token_expired' ) {
        errorMsg = 'LOGIN_TOKEN_EXPIRED';
      }

      $state.go( STATES.LOGIN, {
        stateToRedirect: $state.current.name,
        displayErrorOnInit: errorMsg
      } );
    }

    return $q.reject(error);
  };

  return {
    request,
    response,
    responseError
  };
};

export default AuthInterceptorFactory;
