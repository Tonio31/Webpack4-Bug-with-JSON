class LockedPageController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'LockedPageController' );

    $log.log('Nothing to initialize or do for the lockedPage');

    // throw new Error('TONIO This is a test to see in Bugsnag');
  }
}

export default LockedPageController;
