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
    $log.log('getMenu config=', config);
    return $resource(buildApiUrl('menu', true));
  };

  let getParticipantDetails = () => {
    $log.log('getMenu config=', config);
    return $resource(buildApiUrl('participants', true)).get( (userData) => {
      $log.log('getParticipantDetails() retrieved successfully userData.data=', userData.data );

      let userToSave = {
        id: userData.data.id,
        firstName: userData.data['first_name'], // eslint-disable-line dot-notation
        lastName: userData.data['last_name'], // eslint-disable-line dot-notation
        email: userData.data.email
      };

      User.setUser(userToSave);
    },
      (error) => {
        $log.log('getParticipantDetails() error=', error);
      });
  };


  let getDynamicContentPromise = ( iEndPointUrl, iIsArray, iOptionalParameters = {} ) => {
    $log.log('getDynamicContentPromise iEndPointUrl=', iEndPointUrl, '  iOptionalParameters=', iOptionalParameters);

    let deferred = $q.defer();

    if ( iIsArray ) {
      $resource(buildApiUrl(iEndPointUrl), iOptionalParameters).query().$promise.then( (data) => {
        deferred.resolve(data);
      },
      (error) => {
        $log.log('getDynamicContentPromise error=', error);

        deferred.reject(error);
      });
    }
    else {
      $resource(buildApiUrl(iEndPointUrl), iOptionalParameters).get().$promise.then( (data) => {
        deferred.resolve(data);
      },
      (error) => {
        $log.log('getDynamicContentPromise error=', error);

        deferred.reject(error);
      });
    }

    return deferred.promise;
  };

  // **********************************  POST  *************************************** //
  // Theses resource are to be used with $save method only, because we return an instance
  // of the function, we can't use it to do get method

  let getUserAuthData = () => {
    $log.log('getUserAuthData');
    return new ($resource(buildApiUrl('authenticate')))();
  };

  let updateStep = () => {
    $log.log('updateStep');
    return new ($resource(buildApiUrl('step')))();
  };

  return {
    getMenu,
    getUserAuthData,
    getDynamicContentPromise,
    getParticipantDetails,
    updateStep,
    buildApiUrl
  };
};

export default ResourceFactory;
