let ResourceFactory = function($log, $q, $resource, User, config) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('ResourceFactory');

  let buildApiUrl = (iTypeOfApi, iUserId = false) => {
    let apiUrl = `${config.apiUrl}${config.apiVersion}/${iTypeOfApi}`;

    if ( iUserId ) {
      apiUrl += `/${User.getUserId()}`;
    }

    return apiUrl;
  };

  // **********************************  GET  *************************************** //
  let getMenu = () => {
    $log.log('getMenu()');
    return $resource(buildApiUrl('menu', true));
  };

  let getParticipantDetails = () => {
    $log.log('getParticipantDetails()');
    return $resource(buildApiUrl('participants', true)).get( (userData) => {
      $log.log('getParticipantDetails() retrieved successfully');

      let userToSave = {
        id: userData.data.id,
        firstName: userData.data['first_name'], // eslint-disable-line dot-notation
        lastName: userData.data['last_name'], // eslint-disable-line dot-notation
        email: userData.data.email
      };

      User.setUser(userToSave);
    },
      (error) => {
        $log.error('getParticipantDetails() error=', error);
      });
  };


  let getDynamicContentPromise = ( iEndPointUrl, iIsArray, iOptionalParameters = {} ) => {
    $log.log('getDynamicContentPromise iEndPointUrl=', iEndPointUrl, '  iIsArray=', iIsArray, '  iOptionalParameters=', iOptionalParameters);

    let deferred = $q.defer();

    if ( iIsArray ) {
      $resource(buildApiUrl(iEndPointUrl), iOptionalParameters).query().$promise.then( (data) => {
        deferred.resolve(data);
      },
      (error) => {
        $log.error('getDynamicContentPromise error=', error);

        deferred.reject(error);
      });
    }
    else {
      $resource(buildApiUrl(iEndPointUrl), iOptionalParameters).get().$promise.then( (data) => {
        deferred.resolve(data);
      },
      (error) => {
        $log.error('getDynamicContentPromise error=', error);

        deferred.reject(error);
      });
    }

    return deferred.promise;
  };

  // **********************************  POST  *************************************** //
  // Theses resource are to be used with $save method only, because we return an instance
  // of the function, we can't use it to do get method

  let getUserAuthData = () => {
    $log.log('getUserAuthData()');
    return new ($resource(buildApiUrl('authenticate')))();
  };

  let sendRecoverPasswordEmail = () => {
    $log.log('sendRecoverPasswordEmail()');
    return new ($resource(buildApiUrl('forgotlogin')))();
  };

  let resetPassword = () => {
    $log.log('resetPassword()');
    return new ($resource(buildApiUrl('resetPassword')))();
  };

  let updateStep = () => {
    $log.log('updateStep()');
    return new ($resource(buildApiUrl('programDatas')))();
  };

  return {
    getMenu,
    getUserAuthData,
    sendRecoverPasswordEmail,
    resetPassword,
    getDynamicContentPromise,
    getParticipantDetails,
    updateStep,
    buildApiUrl
  };
};

export default ResourceFactory;
