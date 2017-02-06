let UserFactory = function ($resource) {
  "ngInject";
  const user = {
    name: "Tonio"
  };

  let getUser = () => {
    return user;
  };

  let getMenu = () => {
    return $resource('/menu/:userid', {userid: '@userid'});
  };

  let getUserData = () => {
    console.log("getUserData");
    return $resource('/users/:userid', {userid: '@userid'});
  };


  let getUserData2 = () => {
    console.log("getUserData2");
    return $resource('/users/gdgfdsdfgsgfd');
  };


  return { getUser, getMenu, getUserData, getUserData2 };
};

export default UserFactory;
