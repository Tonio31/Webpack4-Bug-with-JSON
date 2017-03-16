class RetrieveCredentialsController {
  constructor($log, $state, Data, STATES) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'RetrieveCredentialsController' );

    this.emailSent = false;

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
          $log.log('error when sending the recovery email error=', error);
        });
      }
      else {
        $log.log('iForgotCredentialForm is not valid');
        $log.log('iForgotCredentialForm.email=', iForgotCredentialForm.email);
      }

    };
  }
}

export default RetrieveCredentialsController;
