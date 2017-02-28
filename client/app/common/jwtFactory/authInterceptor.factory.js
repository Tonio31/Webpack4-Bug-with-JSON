let AuthInterceptorFactory = function($log, JwtFactory) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('AuthInterceptorFactory');

  // automatically attach Authorization header
  let request = (config) => {
    let token = JwtFactory.getToken();
    let userId = JwtFactory.getUserid();
    config.headers.token = `Bearer ${token}`;
    config.headers.user_id = userId;

    return config;
  };

  // If a token was sent back, save it
  let response = (res) => {
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

  return {
    request,
    response
  };
};

export default AuthInterceptorFactory;
