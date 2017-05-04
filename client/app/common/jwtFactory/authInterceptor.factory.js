/* eslint-disable camelcase */

let AuthInterceptorFactory = function( $log,
                                       $state,
                                       $q,
                                       JwtFactory ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('AuthInterceptorFactory');

  // automatically attach Authorization header
  let request = (config) => {
    let token = JwtFactory.getToken();
    let userId = JwtFactory.getUserId();
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
    if ( res.hasOwnProperty('data') ) {
      if ( res.data.hasOwnProperty('token') ) {
        JwtFactory.saveToken(res.data.token);
      }
    }

    return res;
  };

  let responseError = (error) => {

    $log.log('There was an error during the last communication with the server error.status=', error.status);

    $log.error('error=', error);

    return $q.reject(error);
  };

  return {
    request,
    response,
    responseError
  };
};

export default AuthInterceptorFactory;
