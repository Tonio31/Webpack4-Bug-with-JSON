let ResourceFactory = function($log, $q, $resource, config) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('ResourceFactory');

  const user = {
    name: 'Tonio'
  };

  let buildApiUrl = (iTypeOfApi) => {
    let apiUrl = `${config.apiUrl}${config.apiVersion}/${iTypeOfApi}`;
    return apiUrl;
  };

  let getUser = () => {
    return user;
  };

  // **********************************  GET  *************************************** //
  let getMenu = () => {
    $log.log('getMenu config=', config);
    return $resource(buildApiUrl('menu'));
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
    getUser,
    getMenu,
    getUserAuthData,
    getDynamicContentPromise,
    updateStep,
    buildApiUrl
  };
};

export default ResourceFactory;
