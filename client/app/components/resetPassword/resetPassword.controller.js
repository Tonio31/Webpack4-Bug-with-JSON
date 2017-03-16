class ResetPasswordController {
  constructor($log, $state, $stateParams, $location, STATES, Data) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ResetPasswordController' );

    $log.log('constructor  $stateParams=', $stateParams);
    this.showPassword = false;
    this.showPasswordConfirmation = false;

    this.password = '';
    this.passwordConfirmation = '';

    this.errorFromBackEnd = 0;

    this.comparePassword = (ioResetPasswordForm) => {

      if ( this.password !== this.passwordConfirmation ) {
        $log.warn('Passwords does not match');
        ioResetPasswordForm.password.$setValidity('nomatch', false);
        ioResetPasswordForm.passwordConfirmation.$setValidity('nomatch', false);
      }
      else {
        $log.debug('Passwords match');
        ioResetPasswordForm.password.$setValidity('nomatch', true);
        ioResetPasswordForm.passwordConfirmation.$setValidity('nomatch', true);
      }

      $log.debug('ioResetPasswordForm=', ioResetPasswordForm);
    };

    this.resetPassword = (iResetPasswordForm) => {

      if ( iResetPasswordForm.$valid ) {
        $log.log('iResetPasswordForm is Valid');

        let resetPasswordPOSTRequest = Data.resetPassword();

        resetPasswordPOSTRequest.token = this.token;
        resetPasswordPOSTRequest.user_id = this.userId; // eslint-disable-line camelcase
        resetPasswordPOSTRequest.password = this.password;

        resetPasswordPOSTRequest.$save( () => {
          $log.log('The password change was successful, redirecting to home page');

          $state.go(STATES.HOME);
        },
        (error) => {
          $log.log('error when sending the recovery email error=', error);
          this.errorFromBackEnd += 1;
        });
      }
    };

    this.$onInit = () => {
      $log.log('$onInit $stateParams=', $stateParams);
      this.token = $stateParams.token;
      this.userId = $stateParams.user_id;

      // Remove all url parameters from the URL
      $location.search({});
    };

  }
}

export default ResetPasswordController;
