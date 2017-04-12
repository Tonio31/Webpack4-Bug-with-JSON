class LoginController {
  constructor($log, $state, $stateParams, Data, User, JwtFactory, STATES) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'LoginController' );

    this.username = 'myemail@gmail.com';
    this.password = '';
    this.keepLoggedIn = false;
    this.showPassword = false;

    this.invalidLogin = false;

    this.forgotCredentials = () => {
      $log.log('forgotCredentials()');
      $state.go(STATES.RETRIEVE_CREDENTIALS);
    };


    this.login = (iLoginForm) => {
      $log.log('login()');

      if ( iLoginForm.$valid ) {
        let authPOSTRequest = Data.getUserAuthData();

        authPOSTRequest.email = this.username;
        authPOSTRequest.password = this.password;

        authPOSTRequest.$save( (dataBackFromServer) => {
          $log.log('No error during authentification');

          let userToSave = {
            id: dataBackFromServer.user.id,
            firstName: dataBackFromServer.user['first_name'], // eslint-disable-line dot-notation
            lastName: dataBackFromServer.user['last_name'], // eslint-disable-line dot-notation
            email: dataBackFromServer.user.email,
            token: dataBackFromServer.token
          };

          // Save to local Storage
          JwtFactory.saveToken(dataBackFromServer.token);
          JwtFactory.saveUserId(dataBackFromServer.user.id);

          // Save User Information
          User.setUser(userToSave);

          $state.go(STATES.HOME, { forceRedirect: $stateParams.stateToRedirect } );
        },
        (error) => {
          $log.log('error during authentification error=', error);
          this.invalidLogin = true;
        });
      }
      else {
        // Invalid login form
        $log.log('Login form is invalid');
      }

    };
  }
}

export default LoginController;
