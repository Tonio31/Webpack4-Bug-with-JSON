let ResourceFactory = function($log, $q, $resource) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('ResourceFactory');

  const user = {
    name: 'Tonio'
  };

  let getUser = () => {
    return user;
  };

  let getMenu = () => {
    $log.log('getMenu');
    return $resource('/menu/:userid', { userid: '@userid' });
  };

  let getUserData = () => {
    $log.log('getUserData');
    return $resource('/users/:userid', { userid: '@userid' });
  };


  let getCourseContent = (url) => {
    $log.log('getCourseContent url=', url);


    let deferred = $q.defer();

    $resource(url).get().$promise.then( (data) => {
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
    return getCourseContent('home');
  };


  // This resource funciton is to be used with $save method only, because we return an instance of the function
  // we can't use it to do get method
  let updateStep = () => {
    return new ($resource('/stepcompleted/:stepid', { stepid: '@stepid' }))();
  };

  return {
    getUser,
    getMenu,
    getUserData,
    getCourseContent,
    getHomeContent,
    updateStep
  };
};

export default ResourceFactory;