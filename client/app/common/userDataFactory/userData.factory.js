let UserData = function() {
  'ngInject';

  let user = {
    id: '',
    token: '',
    firstName: '',
    lastName: '',
    email: '',
    companyBanner: {}
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

    if ( iUserObject.hasOwnProperty('email') && iUserObject.email ) {
      user.email = iUserObject.email;
    }

    if ( iUserObject.hasOwnProperty('companyBanner') && iUserObject.companyBanner ) {
      user.companyBanner = iUserObject.companyBanner;
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
    return user.email;
  };

  let getCompanyBanner = () => {
    return user.companyBanner;
  };

  let isUserDefined = () => {
    // eslint-disable-next-line no-unused-vars
    for ( let [ key, value ] of Object.entries(user) ) {
      if ( ( angular.isString(value) && value ) ||
        ( angular.isObject(value) && Object.keys(value).length !== 0 ) ) {
        return true;
      }
    }

    return false;
  };

  return {
    isUserDefined,
    setUser,
    getFirstName,
    getLastName,
    getUserId,
    getSecurityToken,
    getEmail,
    getCompanyBanner
  };

};

export default UserData;
