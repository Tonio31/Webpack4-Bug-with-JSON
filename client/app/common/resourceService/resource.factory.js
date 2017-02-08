let ResourceFactory = function ($resource) {
  "ngInject";
  const user = {
    name: "Tonio"
  };

  let getUser = () => {
    return user;
  };

  let getMenu = () => {
    console.log("ResourceFactory::getMenu");
    return $resource('/menu/:userid', {userid: '@userid'});
  };

  let getUserData = () => {
    console.log("ResourceFactory::getUserData");
    return $resource('/users/:userid', {userid: '@userid'});
  };


  let getCourseContent = (url) => {
    console.log("ResourceFactory::getCourseContent url=", url);
    return $resource(url).get();
  };


  return { getUser, getMenu, getUserData, getCourseContent };
};

export default ResourceFactory;
