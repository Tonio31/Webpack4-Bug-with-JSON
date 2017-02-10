let ResourceFactory = function ($log, $resource) {
  "ngInject";
  const user = {
    name: "Tonio"
  };

  let getUser = () => {
    return user;
  };

  let getMenu = () => {
    $log.log("ResourceFactory::getMenu");
    return $resource('/menu/:userid', {userid: '@userid'});
  };

  let getUserData = () => {
    $log.log("ResourceFactory::getUserData");
    return $resource('/users/:userid', {userid: '@userid'});
  };


  let getCourseContent = (url) => {
    $log.log("ResourceFactory::getCourseContent url=", url);
    return $resource(url).get();
  };


  return { getUser, getMenu, getUserData, getCourseContent };
};

export default ResourceFactory;
