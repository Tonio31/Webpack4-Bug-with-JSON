class PageNotFoundController {
  constructor($log, Menu, $state, $stateParams) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'PageNotFoundController' );

    $log.log('$stateParams.intendedUrl=', $stateParams.intendedUrl);
    this.intendedUrl = {
      url: $stateParams.intendedUrl
    };

    this.displayResumeProgress = Menu.isMenuRetrieved();

    this.resumeProgress = () => {
      let currentStep = Menu.getCurrentProgression().data.current_step.fullUrl;
      $log.log('ResumeProgress(), go to currentStep: ', currentStep);

      $state.go(currentStep);
    };

  }
}

export default PageNotFoundController;
