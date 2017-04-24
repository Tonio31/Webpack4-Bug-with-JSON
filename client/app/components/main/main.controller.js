class MainController {
  constructor($log, ZendeskWidget, $stateParams, User) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'MainController' );

    if ( User.isUserDefined() ) {
      ZendeskWidget.identify({
        name: `${User.getFirstName()} ${User.getLastName()}`,
        email: User.getEmail()
      });

      ZendeskWidget.show();
    }

    $log.debug('$stateParams=', $stateParams);
    this.displayMenu = $stateParams.displayMenu;
  }
}

export default MainController;
