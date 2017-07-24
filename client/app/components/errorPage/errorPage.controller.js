class ErrorPageController {
  constructor( $log,
               $state,
               $stateParams,
               BugsnagUtils,
               ZendeskWidget,
               $filter ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ErrorPageController' );

    $log.log('constructor - START');

    this.sendErrorToBugsnag = () => {
      let statesHistory = BugsnagUtils.getStatesHistoryAsString();
      $log.error(`sendErrorToBUgsnag() - Send an error to Bugsnag statesHistory= ${statesHistory}`);
      BugsnagUtils.notify('User on Error Page', `${$state.current.name}`, { 'STATES HISTORY': statesHistory });
    };

    this.$onInit = () => {
      $log.log('$onInit - $stateParams=', $stateParams);
      this.errorMsg = '';
      let errorCodeToTranslate = $stateParams.errorMsg;
      if ( errorCodeToTranslate ) {
        this.errorMsg = $filter('translate')(errorCodeToTranslate).toString();
      }
      else {
        this.errorMsg = $filter('translate')('ERROR_UNEXPECTED').toString();
      }

      this.displayContactUsForm = $stateParams.displayMenu;

      this.sendErrorToBugsnag();
    };

    this.openWendeskWidget = () => {
      ZendeskWidget.activate();
    };
  }
}

export default ErrorPageController;
