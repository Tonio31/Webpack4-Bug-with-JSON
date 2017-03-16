let UserData = function() {
  'ngInject';

  let user = {
    id: '',
    token: '',
    firstName: '',
    lastName: '',
    email: ''
  };

  let setUser = (iUserObject) => {
    if ( iUserObject.hasOwnProperty('id') && iUserObject.id ) {
      user.id = iUserObject.id;
    }

    if ( iUserObject.hasOwnProperty('token') && iUserObject.token ) {
      user.token = iUserObject.token;
    }

    if ( iUserObject.hasOwnProperty('firstName') && iUserObject.firstName ) {
      user.firstName = iUserObject.firstName;
    }

    if ( iUserObject.hasOwnProperty('lastName') && iUserObject.lastName ) {
      user.lastName = iUserObject.lastName;
    }

    if ( iUserObject.hasOwnProperty('email') && iUserObject.username ) {
      user.username = iUserObject.username;
    }
  };

  let getFirstName = () => {
    return user.firstName;
  };

  let getLastName = () => {
    return user.lastName;
  };

  let getSecurityToken = () => {
    return user.token;
  };

  let getUserId = () => {
    return user.id;
  };

  let getEmail = () => {
    return user.username;
  };

  return {
    setUser,
    getFirstName,
    getLastName,
    getUserId,
    getSecurityToken,
    getEmail
  };

};

export default UserData;
