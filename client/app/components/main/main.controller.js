class MainController {
  constructor( $log,
               ZendeskWidget,
               $stateParams,
               User ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'MainController' );

    if ( User.isUserDefined() ) {
      let userFullName = `${User.getFirstName()} ${User.getLastName()}`;
      ZendeskWidget.identify( userFullName, User.getEmail() );

      ZendeskWidget.show();
    }

    this.displayMenu = $stateParams.displayMenu;
  }
}

export default MainController;
