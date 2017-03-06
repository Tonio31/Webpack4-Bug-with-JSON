/* eslint-disable camelcase */

let AuthInterceptorFactory = function($log, $state, JwtFactory, STATES) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('AuthInterceptorFactory');

  // automatically attach Authorization header
  let request = (config) => {
    let token = JwtFactory.getToken();
    let userId = JwtFactory.getUserid();
    if ( token ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if ( userId ) {
      config.headers.user_id = userId;
    }

    return config;
  };

  // If a token was sent back, save it
  let response = (res) => {
    $log.log('Received a reply form the server with no res.data=', res.data);

    if ( res.hasOwnProperty('data') ) {
      if ( res.data.hasOwnProperty('token') ) {
        JwtFactory.saveToken(res.data.token);
      }

      if ( res.data.hasOwnProperty('user_id') ) {
        JwtFactory.saveUserid(res.data.user_id);
      }
    }

    return res;
  };

  let responseError = (error) => {

    $log.log('There was an error during the last communication with the server error.status=', error.status);

    // If we receive 401, it means the user is not logged in, redirect him to the login page
    // and specify where we have to redirect after login
    if ( error.status === 401 ) {
      $state.go(STATES.LOGIN, { stateToRedirect: $state.$current.name });
    }

    return error;
  };

  return {
    request,
    response,
    responseError
  };
};

export default AuthInterceptorFactory;
