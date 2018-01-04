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

    $log.log('constructor - START');

    this.sendErrorToBugsnag = (iCustomData, iErrorName) => {
      let statesHistory = BugsnagUtils.getStatesHistoryAsString();


      let customData = iCustomData;
      customData['STATES HISTORY'] = statesHistory;

      $log.error(`sendErrorToBugsnag() - Send an error to Bugsnag customData=${angular.toJson(customData)}`);

      BugsnagUtils.notify(
        iErrorName,
        `${$state.current.name}`,
        customData
      );
    };

    this.$onInit = () => {
      $log.log(`$onInit - $stateParams=${angular.toJson($stateParams)}`);
      this.errorMsg = '';
      let errorCodeToTranslate = $stateParams.errorMsg;
      if ( errorCodeToTranslate ) {
        this.errorMsg = $filter('translate')(errorCodeToTranslate).toString();
      }
      else {
        this.errorMsg = $filter('translate')('ERROR_UNEXPECTED').toString();
      }


      this.displayContactUsForm = $stateParams.displayMenu && JwtFactory.isLoginInfoAvailable();

      let customData = Object.assign({}, $stateParams.bugsnagMetaData);
      let errorName = $stateParams.bugsnagErrorName || 'User on Error Page';

      this.sendErrorToBugsnag(customData, errorName);
    };

    this.openWendeskWidget = () => {
      ZendeskWidget.activate();
    };
  }
}

export default ErrorPageController;
