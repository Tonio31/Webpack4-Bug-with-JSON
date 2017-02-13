let ResourceFactory = function ($log, $resource) {
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
    return $resource(url).get();
  };


  return { getUser, getMenu, getUserData, getCourseContent };
};

export default ResourceFactory;
