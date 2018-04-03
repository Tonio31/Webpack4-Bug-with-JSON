class LoginController {
  constructor( $log,
               $state,
               $stateParams,
               $filter,
               Data,
               Utility,
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

    this.error = null;

    this.externalWebsite = '';
    this.triggerSubmitFrom = false;

    // By default, login on program.potentialife.com
    this.forceTargetWebsite = 'program';
    this.$onInit = () => {
      $log.log('$onInit - START');
      if ( angular.isDefined($stateParams.target) ) {
        this.forceTargetWebsite = $stateParams.target;
      }

      if ( $stateParams.displayErrorOnInit ) {
        this.error = $filter('translate')($stateParams.displayErrorOnInit).toString();
      }

      if ( angular.isDefined($stateParams.username) && angular.isDefined($stateParams.pwd) ) {
        this.username = $stateParams.username;
        this.password = $stateParams.pwd;
        this.loginOnProgram();
      }
    };

    this.setInvalidLoginMessage = ( iErrorMsg ) => {
      this.error = $filter('translate')(iErrorMsg).toString();
      SpinnerFactory.hide(SPINNERS.TOP_LEVEL);
    };

    this.forgotCredentials = () => {
      $log.log('forgotCredentials()');
      $state.go(STATES.RETRIEVE_CREDENTIALS);
    };

    this.otherWebsitesToLoginIn = [ 'my', 'change' ];


    this.login = (iLoginForm) => {
      $log.log('login()');

      if ( iLoginForm.$valid ) {
        this.loginOnProgram();
      }
      else {
        // Invalid login form
        $log.log('Login form is invalid');
      }
    };

    this.loginOnProgram = () => {

      SpinnerFactory.show(SPINNERS.TOP_LEVEL);
      this.error = null;
      if ( this.forceTargetWebsite === 'program' ) {

        // Default behaviour, try to login first on program and them on the other two website
        let authPOSTRequest = Data.getUserAuthData();

        authPOSTRequest.email = this.username;
        authPOSTRequest.password = this.password;

        authPOSTRequest.$save( (dataBackFromServer) => {
          $log.log('No error during authentification');

          // Save to local Storage
          JwtFactory.saveToken(dataBackFromServer.token);
          JwtFactory.saveUserId(dataBackFromServer.user.id);

          // Save User Information
          Data.saveUserData(dataBackFromServer.user);

          $state.go(STATES.HOME, { forceRedirect: $stateParams.stateToRedirect } );
        },
        (error) => {
          $log.error('error during authentification error=', error);
          if ( error && error.status === 429 ) {
            // User tried 5 times to login and enter wrong credentials, notify him he's locked for a min
            this.setInvalidLoginMessage('TOO_MANY_LOGIN_ERROR');
          }
          else {
            // If we have an error during login, it might be because the credentials are wrong but
            // it can also be because the user tries to log in on http://my.potentialife.com/ or
            // on http://change.potentialife.com as this login page is used to login to the three application
            this.loginOnOtherPlWebsite(this.otherWebsitesToLoginIn);
          }

        });
      }
      else {
        this.loginOnOtherPlWebsite([ this.forceTargetWebsite ]);
      }

    };

    this.loginOnOtherPlWebsite = (iTargetWebsiteList) => {

      Utility.getUserTargetWebsite(this.username, iTargetWebsiteList).then( (targetWebsite) => {
        let apiUrl = WEBSITE_CONFIG.OTHER_PL_SITES_API[targetWebsite].apiUrl;
        $log.log(`Username ${this.username} exists on ${apiUrl}  targetWebsite=`, targetWebsite);

        // User exists, check if the credentials are correct
        let checkCredentialsApi = WEBSITE_CONFIG.OTHER_PL_SITES_API.api.checkCredentialsApi;
        let checkCredentialsPOSTRequest = Data.checkAuthOnOtherPlWebsite(targetWebsite, checkCredentialsApi);
        checkCredentialsPOSTRequest.user_login = this.username; // eslint-disable-line camelcase
        checkCredentialsPOSTRequest.pass = this.password;
        checkCredentialsPOSTRequest.$check( (dataBackFromcheckCredentials) => {
          if ( dataBackFromcheckCredentials.hasOwnProperty('user') ) {
            $log.log(`Username/password valid on ${apiUrl}  dataBackFromServer=`, dataBackFromcheckCredentials);
            this.externalWebsite = WEBSITE_CONFIG.OTHER_PL_SITES_API[targetWebsite].loginUrl;

            // Directive plSubmit is watching changes on this boolean, the change will trigger the hidden form to be submitted
            // which will trigger login on http://change.potentialife.com/wp-login.php website
            this.triggerSubmitFrom = true;
          }
          else {
            $log.log(`Username/password NOT valid on ${apiUrl}  error=`, dataBackFromcheckCredentials.errors.incorrect_password[0]);
            this.setInvalidLoginMessage('LOGIN_FAILED');
          }
        },
        (error) => {
          $log.log(`Unexpected error while checking username/password on ${apiUrl} error=`, error);
          this.setInvalidLoginMessage('LOGIN_FAILED');
        });
      },
      (error) => {

        $log.log(`BEFORE this.setInvalidLoginMessage() error=`, error);
        this.setInvalidLoginMessage('LOGIN_FAILED');
      });
    };

  }
}

export default LoginController;
