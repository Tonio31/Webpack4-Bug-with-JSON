class ErrorPageController {
  constructor( $log,
               $state,
               $stateParams,
               JwtFactory,
               BugsnagUtils,
               SpinnerFactory,
               ZendeskWidget,
               $filter ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ErrorPageController' );

    this.sendErrorToBugsnag = (iCustomData, iErrorName) => {
      let statesHistory = BugsnagUtils.getStatesHistoryAsString();

      let customData = iCustomData;
      customData['STATES HISTORY'] = statesHistory;

      BugsnagUtils.notify(
        iErrorName,
        `${$state.current.name}`,
        customData
      );
    };

    this.$onInit = () => {

      SpinnerFactory.hideAll();

      this.isMaintenanceMode = false;

      this.subErrorMsg = '';

      this.errorMsg = '';
      if ( $stateParams.errorMsg ) {


        if ( $stateParams.subErrorMsg ) {
          this.subErrorMsg = $filter('translate')($stateParams.subErrorMsg).toString();
        }

        if ( $stateParams.errorMsg === 'DOWN_FOR_MAINTENANCE' ) {
          this.isMaintenanceMode = true;
          this.subErrorMsg = $filter('translate')('MAINTENANCE_BACK_SHORTLY').toString();
        }

        this.errorMsg = $filter('translate')($stateParams.errorMsg).toString();
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
