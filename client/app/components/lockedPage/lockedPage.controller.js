class LockedPageController {
  constructor($log, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'LockedPageController' );

    this.ICON_FONTELLO = ICON_FONTELLO;

    $log.log('Nothing to initialize or do for the lockedPage');
  }
}

export default LockedPageController;
