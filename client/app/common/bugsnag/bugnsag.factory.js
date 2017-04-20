let BugsnagFactory = function($log, User) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('BugsnagFactory');

  // This function will be called whenever an exception is thrown before sending a bug report to bugsnag
  // Modify payload below to alter the data you want to send to bugsnap
  //        Full list of options: https://docs.bugsnag.com/api/error-reporting/
  // modify metaData to add new tabs in Bugsnag (add metaData as parameter after payload if needed)

  return (payload) => {

    if ( ENVIRONMENT === 'development' ) {
      // Don't notify Bugsnag for localhost development
      return false;
    }

    payload.user = {
      id: User.getUserId(),
      name: `${User.getFirstName()} ${User.getLastName()}`,
      email: User.getEmail()
    };

    $log.info('BUGSNAG report. payload=', payload);
    return true;
  };
};

export default BugsnagFactory;
