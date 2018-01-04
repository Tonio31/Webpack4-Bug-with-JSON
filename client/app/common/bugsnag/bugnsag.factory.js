let BugsnagFactory = function($log, User) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('BugsnagFactory');

  // This function will be called whenever an exception is thrown before sending a bug report to bugsnag
  // Modify payload below to alter the data you want to send to bugsnap
  //        Full list of options: https://docs.bugsnag.com/api/error-reporting/
  // modify metaData to add new tabs in Bugsnag (add metaData as parameter after payload if needed)
  return (payload) => {

    $log.error(`BUGSNAG report. error=${payload.name},   payload=`, payload);
    if ( ENVIRONMENT === 'development' ) {
      // Don't notify Bugsnag for localhost development
      $log.warn('The report won\'t be sent to bugsnag because it\'s in local');
      return false;
    }

    payload.user = {
      id: User.getUserId(),
      name: `${User.getFirstName()} ${User.getLastName()}`,
      email: User.getEmail()
    };

    return true;
  };
};

export default BugsnagFactory;
