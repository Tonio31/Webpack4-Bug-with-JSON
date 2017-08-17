class RetrieveCredentialsController {
  constructor($log, $state, $stateParams, $filter, Data, STATES) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'RetrieveCredentialsController' );

    this.emailSent = false;
    this.errorDuringRequest = false;

    this.$onInit = () => {
      $log.log( '$onInit - START' );

      if ( $stateParams.displayErrorOnInit ) {
        this.errorOnInit = $filter( 'translate' )( $stateParams.displayErrorOnInit ).toString();
      }
    };

    this.backToLogin = () => {
      $state.go(STATES.LOGIN);
    };

    this.resetPassword = (iForgotCredentialForm) => {
      $log.log('resetPassword()');

      if ( iForgotCredentialForm.$valid ) {
        let forgotCredentialsPOSTRequest = Data.sendRecoverPasswordEmail();

        forgotCredentialsPOSTRequest.email = this.email;

        forgotCredentialsPOSTRequest.$save( () => {
          $log.log('Success an email will be sent to the user from the backend');

          this.emailSent = true;
        },
        (error) => {
          $log.error('error when sending the recovery email error=', error);
          this.errorDuringRequest = true;
        });
      }
      else {
        $log.log('iForgotCredentialForm is not valid email=', iForgotCredentialForm.email);
      }

    };
  }
}

export default RetrieveCredentialsController;
