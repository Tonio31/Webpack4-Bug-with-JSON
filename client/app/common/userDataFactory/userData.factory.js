let UserData = function () {
  "ngInject";

  let user = {
    userid: "12",
    securityToken: "dbhk&*&(dsh^£{}FDSgy26vU*(£^$Qbfb",
    firstName: "Matthew",
    lastName: ""
  };


  let getFirstName = () => {
    return user.firstName;
  };


  let getSecurityToken = () => {
    return user.securityToken;
  };

  let getUserid = () => {
    return user.userid;
  };

  let setUserid = (userid) => {
    user.userid = userid;
  };

  return { getFirstName, getUserid, setUserid, getSecurityToken };

};

export default UserData;
