class LoginController {
  constructor( $log,
               $state,
               $stateParams,
               $window,
               Data,
               User,
               JwtFactory,
               STATES,
               SpinnerFactory,
               SPINNERS,
               WEBSITE_CONFIG ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'LoginController' );

    this.username = '';
    this.password = '';
    this.keepLoggedIn = false;
    this.showPassword = false;

    this.invalidLogin = false;


    this.setInvalidLoginMessage = () => {
      this.invalidLogin = true;
      SpinnerFactory.hide(SPINNERS.TOP_LEVEL);
    };

    this.forgotCredentials = () => {
      $log.log('forgotCredentials()');
      $state.go(STATES.RETRIEVE_CREDENTIALS);
    };

    this.login = (iLoginForm) => {
      $log.log('login()');

      if ( iLoginForm.$valid ) {
        SpinnerFactory.show(SPINNERS.TOP_LEVEL);
        this.invalidLogin = false;
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

          // Retrieve Participants detail informations
          Data.getParticipantDetails().then( () => {
            $state.go(STATES.HOME, { forceRedirect: $stateParams.stateToRedirect } );
          },
          () => {
            $state.go(STATES.ERROR_PAGE_NO_MENU, { errorMsg: 'ERROR_UNEXPECTED' });
          });

        },
        (error) => {
          $log.error('error during authentification error=', error);

          // If we have an error during login, it might be because the credentials are wrong but
          // it can also be because the user tries to log in on http://my.potentialife.com/ or
          // on http://change.potentialife.com as this login page is used to login to the three application

          // Check if user has valid credentials on http://change.potentialife.com
          this.loginOnChangePotentialife();
        });
      }
      else {
        // Invalid login form
        $log.log('Login form is invalid');
      }

    };

    this.loginOnChangePotentialife = () => {
      let checkUsernamePOSTRequest = Data.checkAuthOnChangePotentialife(WEBSITE_CONFIG.OTHER_PL_SITES_API.change.checkUsernameApi);
      checkUsernamePOSTRequest.user_login = this.username;
      // checkUsernamePOSTRequest.section = WEBSITE_CONFIG.OTHER_PL_SITES_API.change.checkUsernameApi;
      checkUsernamePOSTRequest.$check( (dataBackFromServer) => {
        if ( dataBackFromServer.hasOwnProperty('status') && dataBackFromServer.status === 'not_found' ) {
          $log.log(`Username '${this.username}' DOES NOT exists on http://change.potentialife.com/`);
          this.setInvalidLoginMessage();
        }
        else {

          $log.log(`Username ${this.username} exists on http://change.potentialife.com/  dataBackFromServer=`, dataBackFromServer);

          // User exists, check if the credentials are correct
          let checkCredentialsPOSTRequest = Data.checkAuthOnChangePotentialife(WEBSITE_CONFIG.OTHER_PL_SITES_API.change.checkCredentialsApi);
          checkCredentialsPOSTRequest.user_login = this.username;
          checkCredentialsPOSTRequest.pass = this.password;
          checkCredentialsPOSTRequest.$check( (dataBackFromServer) => {
            if ( dataBackFromServer.hasOwnProperty('errors') && dataBackFromServer.errors.hasOwnProperty('incorrect_password') ) {
              $log.log(`Username/password NOT valid on http://change.potentialife.com/  error=`, dataBackFromServer.errors.incorrect_password[0]);
              this.setInvalidLoginMessage();
            }
            else if ( dataBackFromServer.hasOwnProperty('user') && dataBackFromServer.user === '1' ) {

              $log.log(`Username/password valid on http://change.potentialife.com/  dataBackFromServer=`, dataBackFromServer);
              $log.log(`this.testTonio=`, this.testTonio);
              this.externalLogin = 'http://change.potentialife.com/wp-login.php';
              this.testTonio.submit();
            }


          },
          (error) => {
            $log.log(`Unexpected error while checking username/password on http://change.potentialife.com/ error=`, error);
            this.setInvalidLoginMessage();
          });
        }
      },
      (error) => {
        $log.log(`Unexpected error while checking if username exist on http://change.potentialife.com/ error=`, error);
        this.setInvalidLoginMessage();
      });
    };
  }
}

export default LoginController;
