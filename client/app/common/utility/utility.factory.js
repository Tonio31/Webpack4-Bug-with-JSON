let UtilityFactory = function( $log, $state, $window, $localStorage, User ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('UtilityFactory');

  let goToLink = (iUrl) => {
    let reExternalUrl = /^https?:\/\/.*$/;
    if ( iUrl.match(reExternalUrl) ) {
      $log.log('About to redirect to different URL: ', iUrl);
      $window.open( iUrl, '_blank' );
    }
    else {
      $log.log('About to change state to go to: ', iUrl);
      $state.go(iUrl);
    }
  };

  let buildLocalStorageKey = (iKey) => {
    return `${User.getUserId()}-${iKey}`;
  };


  // This function is used when the server returns an error when saving the data from a courseContent
  // We save the user input to local storage so we can restore it when they refresh the page
  let saveUserInputToLocalStorage = (iInputFields) => {
    Object.entries(iInputFields).forEach( ([ key, value ]) => {
      $log.log(`storing ${buildLocalStorageKey(key)}:${value} to local storage`);
      $localStorage[buildLocalStorageKey(key)] = angular.toJson(value, false);
    });
  };

  let getUserInputFromLocalStorage = (iKey) => {
    return angular.fromJson($localStorage[buildLocalStorageKey(iKey)]);
  };

  // If there was an error before, user inputs will have been saved to local storage, if user refresh and retry
  // the data is safely saved on server side, we can remove the data form local storage
  let removeUserInputFromLocalStorage = (iInputFields) => {

    // eslint-disable-next-line no-unused-vars
    for ( let [ key, value ] of Object.entries(iInputFields)) {
      $log.log(`deleting ${buildLocalStorageKey(key)} from local storage`);
      delete $localStorage[buildLocalStorageKey(key)];
    }
  };

  return {
    saveUserInputToLocalStorage,
    getUserInputFromLocalStorage,
    removeUserInputFromLocalStorage,
    buildLocalStorageKey,
    goToLink
  };
};

export default UtilityFactory;
