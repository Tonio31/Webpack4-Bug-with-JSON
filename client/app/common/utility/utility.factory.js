let UtilityFactory = function( $log,
                               $q,
                               $state,
                               $window,
                               $localStorage,
                               Data,
                               User,
                               WEBSITE_CONFIG ) {
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


  let getUserTargetWebsite = (iUserEmail, iTargetWebsiteList) => {

    let deferred = $q.defer();

    let otherWebsitesToLoginIn = [];
    Object.assign(otherWebsitesToLoginIn, iTargetWebsiteList);
    let firstWebsiteToCheck = otherWebsitesToLoginIn[0];
    otherWebsitesToLoginIn.shift();


    let apiUrl = WEBSITE_CONFIG.OTHER_PL_SITES_API[firstWebsiteToCheck].apiUrl;
    $log.log(`getUserTargetWebsite() - is user defined on ${apiUrl} iUserEmail=`, iUserEmail, '  iTargetWebsiteList=', iTargetWebsiteList);

    let checkUserNameApi = WEBSITE_CONFIG.OTHER_PL_SITES_API.api.checkUsernameApi;
    let checkUsernamePOSTRequest = Data.checkAuthOnOtherPlWebsite(firstWebsiteToCheck, checkUserNameApi);
    checkUsernamePOSTRequest.user_login = iUserEmail; // eslint-disable-line camelcase
    checkUsernamePOSTRequest.$check( (dataBackFromServer) => {
      if (dataBackFromServer.hasOwnProperty('status') && dataBackFromServer.status === 'ok') {
        $log.log(`Username ${iUserEmail} exists on ${apiUrl}  dataBackFomServer=`, dataBackFromServer);
        deferred.resolve(firstWebsiteToCheck);
      }
      else {
        $log.log(`Username '${iUserEmail}' DOES NOT exists on ${apiUrl} - status=${dataBackFromServer.status}`);
        if (otherWebsitesToLoginIn.length > 0) {
          $log.log(`otherWebsitesToLoginIn.length > 0     otherWebsitesToLoginIn=`, otherWebsitesToLoginIn);
          getUserTargetWebsite(iUserEmail, otherWebsitesToLoginIn).then( (targetWebsite) => {
            deferred.resolve(targetWebsite);
          },
          (error) => {
            deferred.reject(error);
          });
        }
        else {
          $log.log(`User/Emil ${iUserEmail} does not exist anywhere`);
          deferred.reject('User/Email does not exist');
        }
      }
    },
    (error) => {
      $log.log(`Unexpected error while checking if username exist on ${apiUrl} error=`, error);
      deferred.reject(error);
    });

    return deferred.promise;
  };

  return {
    saveUserInputToLocalStorage,
    getUserInputFromLocalStorage,
    removeUserInputFromLocalStorage,
    buildLocalStorageKey,
    goToLink,
    getUserTargetWebsite
  };
};

export default UtilityFactory;
