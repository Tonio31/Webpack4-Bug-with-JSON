class ErrorPageController {
  constructor( $log,
               $state,
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

      BugsnagUtils.notify(
        iErrorName,
        `${$state.current.name}`,
        customData
      );
    };

    this.$onInit = () => {
      this.errorMsg = '';
      let errorCodeToTranslate = this.data.hasOwnProperty('errorMsg') ? this.data.errorMsg : null;
      if ( errorCodeToTranslate ) {
        this.errorMsg = $filter('translate')(errorCodeToTranslate).toString();
      }
      else {
        this.errorMsg = $filter('translate')('ERROR_UNEXPECTED').toString();
      }

      this.displayContactUsForm = this.data.displayContactUsForm && JwtFactory.isLoginInfoAvailable();

      let customData = Object.assign({}, this.data.bugsnagMetaData);
      let errorName = this.data.bugsnagErrorName || 'User on Error Page';

      this.sendErrorToBugsnag(customData, errorName);
    };

    this.openWendeskWidget = () => {
      ZendeskWidget.activate();
    };
  }
}

export default ErrorPageController;
