class ErrorPageController {
  constructor( $log,
               $state,
               $stateParams,
               JwtFactory,
               BugsnagUtils,
               ZendeskWidget,
               $filter ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ErrorPageController' );

    this.sendErrorToBugsnag = (iCustomData, iErrorName) => {
      let statesHistory = BugsnagUtils.getStatesHistoryAsString();

      let customData = iCustomData;
      customData['STATES HISTORY'] = statesHistory;

      try {
        BugsnagUtils.notify(
          iErrorName,
          `${$state.current.name}`,
          customData
        );
      }
      catch (error) {
        $log.warn('TONIO ERROR error=', error);
      }
    };

    this.$onInit = () => {

      this.errorMsg = '';
      let errorCodeToTranslate = $stateParams.errorMsg;
      if ( errorCodeToTranslate ) {
        this.errorMsg = $filter('translate')(errorCodeToTranslate).toString();

        this.displayContactUsForm = $stateParams.displayMenu && JwtFactory.isLoginInfoAvailable();

        let customData = Object.assign({}, $stateParams.bugsnagMetaData);
        let errorName = $stateParams.bugsnagErrorName || 'User on Error Page';

        this.sendErrorToBugsnag(customData, errorName);
      }
      else {
        this.errorMsg = $filter('translate')('ERROR_UNEXPECTED').toString();
      }

    };

    this.openWendeskWidget = () => {
      ZendeskWidget.activate();
    };
  }
}

export default ErrorPageController;
