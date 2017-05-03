class ErrorPageController {
  constructor($log, $stateParams, $filter) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ErrorPageController' );

    $log.log('constructor - START');

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
    };
  }
}

export default ErrorPageController;
