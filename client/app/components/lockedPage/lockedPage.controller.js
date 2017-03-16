class LockedPageController {
  constructor($log, $state, ICON_FONTELLO, Menu) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'LockedPageController' );

    this.ICON_FONTELLO = ICON_FONTELLO;

    this.resumeProgress = () => {
      let currentStep = Menu.getCurrentProgression().data.current_step.fullUrl;
      $log.log('ResumeProgress(), go to currentStep: ', currentStep);

      $state.go(currentStep);
    };

  }
}

export default LockedPageController;
