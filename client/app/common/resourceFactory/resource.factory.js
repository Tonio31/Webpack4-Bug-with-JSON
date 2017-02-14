let ResourceFactory = function ($log, $q, $resource) {
  "ngInject";

  $log = $log.getInstance("ResourceFactory");

  const user = {
    name: "Tonio"
  };

  let getUser = () => {
    return user;
  };

  let getMenu = () => {
    $log.log("getMenu");
    return $resource('/menu/:userid', {userid: '@userid'});
  };

  let getUserData = () => {
    $log.log("getUserData");
    return $resource('/users/:userid', {userid: '@userid'});
  };


  let getCourseContent = (url) => {
    $log.log("getCourseContent url=", url);


    let deferred = $q.defer();

    $resource(url).get().$promise.then( function(data){
      deferred.resolve(data);
    },
    function(error){
      $log.log("getCourseContent error=", error);

      deferred.reject(error);
    });

    return deferred.promise;
  };


  return { getUser, getMenu, getUserData, getCourseContent };
};

export default ResourceFactory;
