let UserData = function() {
  'ngInject';

  let user = {
    id: '',
    token: '',
    firstName: '',
    lastName: '',
    company: '',
    division: '',
    cohort: '',
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

    if ( iUserObject.hasOwnProperty('company') && iUserObject.company ) {
      user.company = iUserObject.company;
    }

    if ( iUserObject.hasOwnProperty('division') && iUserObject.division ) {
      user.division = iUserObject.division;
    }

    if ( iUserObject.hasOwnProperty('cohort') && iUserObject.cohort ) {
      user.cohort = iUserObject.cohort;
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

  let getCompany = () => {
    return user.company;
  };

  let getDivision = () => {
    return user.division;
  };

  let getCohort = () => {
    return user.cohort;
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
    getCompany,
    getDivision,
    getCohort,
    getUserId,
    getSecurityToken,
    getEmail,
    getCompanyBanner
  };

};

export default UserData;
