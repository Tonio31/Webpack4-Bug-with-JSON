let UserFactory = function ($resource) {
  "ngInject";
  const user = {
    name: "Tonio"
  };

  let getUser = () => {
    return user;
  };

  let isSignedIn = () => {
    return user.isSignedIn;
  };

  let getUserData = () => {
    console.log("getUserData");
    return $resource('/users/:userid', {userid: '@userid'});
  };


  let getUserData2 = () => {
    console.log("getUserData2");
    return $resource('/users/gdgfdsdfgsgfd');
  };

  return { getUser, isSignedIn, getUserData, getUserData2 };
};

export default UserFactory;
