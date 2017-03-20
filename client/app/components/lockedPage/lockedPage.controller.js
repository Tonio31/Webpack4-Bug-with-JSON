class LockedPageController {
  constructor($log, $filter, ICON_FONTELLO, Menu) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'LockedPageController' );

    this.iconTextDataBinding = {
      icon: {
        type: ICON_FONTELLO.LOCK,
        color: ''
      },
      text: `<h1>${$filter('translate')('CONTENT_LOCKED')}<\/h1>
             <h3>${$filter('translate')('CONTENT_LOCKED_DETAILS')}<\/h3>`,
      button: {
        href: Menu.getCurrentProgression().data.current_step.fullUrl,
        color: 'primary',
        label: $filter('translate')('RESUME_YOUR_PROGRESS')
      }
    };
  }
}

export default LockedPageController;
