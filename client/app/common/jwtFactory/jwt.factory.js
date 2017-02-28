let JwtFactory = function($log, $window, $localStorage) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('JwtFactory');

  // Save Token Id to local Storage
  let saveToken = (iToken) => {
    $localStorage[`pl2-token`] = iToken;
  };

  // Retrieve Token from local Storage
  let getToken = () => {
    return $localStorage[`pl2-token`];
  };

  // Save userid to local Storage
  let saveUserid = (iUserid) => {
    $localStorage[`pl2-userid`] = iUserid;
  };

  // Retrieve userId from local Storage
  let getUserid = () => {
    return $localStorage[`pl2-userid`];
  };

  let parseJwt = (iToken) => {
    let base64Url = iToken.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return angular.fromJson($window.atob(base64));
  };

  let isAuthed = () => {
    let token = getToken();
    if ( token ) {
      let params = parseJwt(token);

      // Unix Time is in seconds while JavaScript Date.now() returns milliseconds, so a conversion is necessary.
      return Math.round(new Date().getTime() / 1000) <= params.exp;
    }

    return false;
  };


  let logout = () => {
    delete $localStorage[`pl2-userid`];
    delete $localStorage[`pl2-token`];
  };


  return {
    saveToken,
    getToken,
    saveUserid,
    getUserid,
    parseJwt,
    isAuthed,
    logout
  };
};

export default JwtFactory;
