/* eslint-disable no-undef */

let BugsnagFactory = function($log, User) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('BugsnagFactory');

  // This funciton will be called whenever an exception is throw before sending a bug report to bugsnag
  // Modify payload below to alter the data you want to send to bugsnap
  //        Full list of options: https://docs.bugsnag.com/api/error-reporting/
  // modify metaData to add new tabs in Bugsnag (add metaData as parameter after payload if needed)

  return (payload) => {
    payload.user = {
      id: User.getUserId(),
      name: `${User.getFirstName()} ${User.getLastName()}`,
      username: User.getEmail()
    };

    $log.debug(payload);
    return true;
  };
};

export default BugsnagFactory;
