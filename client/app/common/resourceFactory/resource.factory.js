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

  let getMenu = () => {
    $log.log('getMenu config=', config);
    return $resource(buildApiUrl('menu'));
  };

  let getUserAuthData = () => {
    $log.log('getUserAuthData');
    return new ($resource(buildApiUrl('authenticate')))();
  };


  let getCourseContent = (iStepFullUrl) => {
    $log.log('getCourseContent iStepFullUrl=', iStepFullUrl);

    let deferred = $q.defer();

    $resource(buildApiUrl('step'), {
      slug: iStepFullUrl
    }).get().$promise.then( (data) => {
      deferred.resolve(data);
    },
    (error) => {
      $log.log('getCourseContent error=', error);

      deferred.reject(error);
    });

    return deferred.promise;
  };

  let getHomeContent = () => {
    $log.log('getHomeContent');

    let deferred = $q.defer();

    $resource(buildApiUrl('reflexion')).get().$promise.then( (data) => {
      deferred.resolve(data);
    },
      (error) => {
        $log.log('getCourseContent error=', error);

        deferred.reject(error);
      });

    return deferred.promise;
  };


  // This resource funciton is to be used with $save method only, because we return an instance of the function
  // we can't use it to do get method
  let updateStep = () => {
    return new ($resource(buildApiUrl('step')))();
  };

  return {
    getUser,
    getMenu,
    getUserAuthData,
    getCourseContent,
    getHomeContent,
    updateStep,
    buildApiUrl
  };
};

export default ResourceFactory;
