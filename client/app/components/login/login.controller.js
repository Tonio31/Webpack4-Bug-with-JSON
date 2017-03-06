class LoginController {
  constructor($log, $state, $stateParams, Data, STATES) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'LoginController' );

    this.email = 'myemail@gmail.com';
    this.password = 'whatever';

    this.login = () => {
      $log.log('$stateParams=', $stateParams);

      let authPOSTRequest = Data.getUserAuthData();

      authPOSTRequest.email = this.email;
      authPOSTRequest.password = this.password;

      authPOSTRequest.$save( () => {

        $log.log('No error during authentification');

        $state.go(STATES.HOME, { forceRedirect: $stateParams.stateToRedirect } );
      },
      (error) => {
        $log.log('error during authentification error=', error);
      });
    };
  }
}

export default LoginController;
