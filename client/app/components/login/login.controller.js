class LoginController {
  constructor($log, $state, $stateParams, Data, User, JwtFactory, STATES) {
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

      authPOSTRequest.$save( (dataBackFromServer) => {


        $log.log('No error during authentification dataBackFromServer=', dataBackFromServer);

        let userToSave = {
          id: dataBackFromServer.user.id,
          firstName: dataBackFromServer.user['first_name'], // eslint-disable-line dot-notation
          lastName: dataBackFromServer.user['last_name'], // eslint-disable-line dot-notation
          email: dataBackFromServer.user.email,
          token: dataBackFromServer.token,
        };

        // Save to local Storage
        JwtFactory.saveToken(dataBackFromServer.token);
        JwtFactory.saveUserId(dataBackFromServer.user.id);

        // Save User Informtation
        User.setUser(userToSave);

        $state.go(STATES.HOME, { forceRedirect: $stateParams.stateToRedirect } );
      },
      (error) => {
        $log.log('error during authentification error=', error);
      });
    };
  }
}

export default LoginController;
