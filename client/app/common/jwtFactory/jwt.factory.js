let JwtFactory = function($log, $window, $localStorage, TOKEN, USER_ID) {
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

  let isAuthedExpired = () => {

    let token = getToken();

    if ( token ) {
      let params = parseJwt(token);

      return Math.round(new Date().getTime() / 1000) >= params.exp;
    }

    return true;
  };

  let logout = () => {
    delete $localStorage[USER_ID];
    delete $localStorage[TOKEN];
  };

  return {
    saveToken,
    saveUserId,
    getToken,
    getUserId,
    parseJwt,
    isAuthedExpired,
    logout
  };
};

export default JwtFactory;
