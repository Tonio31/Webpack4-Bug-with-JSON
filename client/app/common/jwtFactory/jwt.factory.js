let JwtFactory = function( $log,
                           $window,
                           $localStorage,
                           $location,
                           TOKEN,
                           USER_ID ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('JwtFactory');

  // Save Token Id to local Storage
  let saveToken = (iToken) => {
    $localStorage[TOKEN] = iToken;
  };

  let saveUserId = (iUserId) => {
    $localStorage[USER_ID] = iUserId;
  };

  let logout = () => {
    delete $localStorage[USER_ID];
    delete $localStorage[TOKEN];
  };

  // Retrieve Token from memory or local Storage if not yet stored in memory
  let getToken = () => {
    return $localStorage[TOKEN];
  };

  // Retrieve userId from memory or local Storage if not yet stored in memory
  let getUserId = () => {
    return $localStorage[USER_ID];
  };

  let parseJwt = (iToken) => {
    let base64Url = iToken.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return angular.fromJson($window.atob(base64));
  };

  let isAuthExpired = () => {

    let token = getToken();

    if ( token ) {
      try {
        let params = parseJwt(token);

        return Math.round(new Date().getTime() / 1000) >= params.exp;
      }
      catch (error) {
        $log.error('Error parsing the security token, delete Token and User_id');
        logout();
      }
    }

    return true;
  };

  let isLoginInfoAvailable = () => {

    let returnValue = false;

    // If there is a token is the URL, it means we're trying remote login
    let urlArgs = $location.search();
    if ( urlArgs.hasOwnProperty('token') ) {
      saveToken(urlArgs.token);

      if ( urlArgs.hasOwnProperty('user_id') ) {
        saveUserId(urlArgs.user_id);
      }

      $location.search({});
      returnValue = true;
    }
    else if ( !isAuthExpired() ) {
      returnValue = true;
    }

    return returnValue;
  };


  let isAuthError = (iError) => {
    if ( iError.status === 401 ) {
      $log.warn('isAuthError - receive a 401 error=', iError);
      return true;
    }

    return false;
  };


  return {
    saveToken,
    saveUserId,
    getToken,
    getUserId,
    parseJwt,
    isAuthExpired,
    isAuthError,
    isLoginInfoAvailable,
    logout
  };
};

export default JwtFactory;
