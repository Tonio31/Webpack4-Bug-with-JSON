let AuthInterceptorFactory = function($log, JwtFactory) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('AuthInterceptorFactory');

  // automatically attach Authorization header
  let request = (config) => {

    // let token = JwtFactory.getToken();
    let token = 'test TOKEN';
    // let userId = JwtFactory.getUserid();
    let userId = 'TEST USER ID';
    config.headers.token = token;
    config.headers.userId = userId;

    return config;
  };

  // If a token was sent back, save it
  let response = (res) => {

    if ( res.config.url.indexOf('api') === 0 && res.data.token) {
      $log.log('TONIO SAVE token');
      JwtFactory.saveToken(res.data.token);
      JwtFactory.saveUserid(res.data.userId);
    }
    else {
      $log.log('TONIO dont save token');
    }

    return res;
  };

  return {
    request,
    response
  };
};

export default AuthInterceptorFactory;
