class ResetPasswordController {
  constructor( $log,
               $state,
               $stateParams,
               $filter,
               $location,
               JwtFactory,
               SpinnerFactory,
               STATES,
               SPINNERS,
               Data ) {
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

      // At least 8 characters, one uppercase, one lowercase, one number
      // let regExpPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

      // At least 8 characeters, no space
      let regExpPass = /^[^\s]{8,}$/;
      if ( regExpPass.test(this.password) ) {
        ioResetPasswordForm.password.$setValidity('complexity', true);
      }
      else {
        ioResetPasswordForm.password.$setValidity('complexity', false);
      }

      if ( this.password !== this.passwordConfirmation ) {
        $log.log('Passwords do not match');
        ioResetPasswordForm.password.$setValidity('nomatch', false);
        ioResetPasswordForm.passwordConfirmation.$setValidity('nomatch', false);
      }
      else {
        $log.log('Passwords match');
        ioResetPasswordForm.password.$setValidity('nomatch', true);
        ioResetPasswordForm.passwordConfirmation.$setValidity('nomatch', true);
      }
    };

    this.resetPassword = (iResetPasswordForm) => {

      if ( iResetPasswordForm.$valid ) {
        $log.log('iResetPasswordForm is Valid');

        SpinnerFactory.show(SPINNERS.TOP_LEVEL);

        let resetPasswordPOSTRequest = Data.resetPassword();

        resetPasswordPOSTRequest.token = this.token;
        resetPasswordPOSTRequest.password = this.password;

        resetPasswordPOSTRequest.$save( (dataBackFromServer) => {
          $log.log('The password change was successful, redirecting to home page');

          // Save to local Storage
          JwtFactory.saveToken(dataBackFromServer.token);
          JwtFactory.saveUserId(dataBackFromServer.user.id);

          // Save User Information
          Data.saveUserData(dataBackFromServer.user);

          $state.go(STATES.HOME);
        },
        (error) => {
          $log.log('error when resetting password error=', error);
          if ( error.status === 401 && error.statusText === 'token_expired' ) {
            $state.go(STATES.RETRIEVE_CREDENTIALS, {
              displayErrorOnInit: 'RESET_PASSWORD_TOKEN_EXPIRED'
            });
          }
          else {
            this.errorFromBackEnd += 1;
            SpinnerFactory.hide(SPINNERS.TOP_LEVEL);
          }
        });
      }
    };

    this.$onInit = () => {
      $log.log('$onInit $stateParams=', $stateParams);
      this.token = $stateParams.token;
      this.userId = $stateParams.user_id;
      this.labelAction = '';

      if ( $stateParams.action === 'creation' ) {
        this.labelAction = $filter('translate')('CREATE_PASSWORD');
      }
      else if ( $stateParams.action === 'reset' ) {
        this.labelAction = $filter('translate')('RESET_PASSWORD');
      }
      else {
        throw new Error(`Action (${$stateParams.action}) parameter unknown`);
      }
    };
  }
}

export default ResetPasswordController;
