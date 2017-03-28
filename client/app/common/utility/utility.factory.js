let UtilityController = function( $log, $state, $window ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('MenuFactory');

  let goToLink = (iUrl) => {
    let reExternalUrl = /^https?:\/\/.*$/;
    if ( iUrl.match(reExternalUrl) ) {
      $window.location.href = iUrl;
    }
    else {
      $state.go(iUrl);
    }
  };

  return {
    goToLink
  };
};

export default UtilityController;
