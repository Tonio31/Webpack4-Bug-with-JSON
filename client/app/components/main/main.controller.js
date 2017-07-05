class MainController {
  constructor( $log,
               ZendeskWidget,
               $stateParams,
               User ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'MainController' );

    $log.warn('TONIOOohggjhjfghnfdfddfvvdffdsgbdbfbfdsbsfdfdbbdsgfsbd');
    if ( User.isUserDefined() ) {
      $log.warn('User is defined');
      let userFullName = `${User.getFirstName()} ${User.getLastName()}`;
      ZendeskWidget.identify( userFullName, User.getEmail() );

      ZendeskWidget.show();
    }

    $log.log('$stateParams=', $stateParams);
    this.displayMenu = $stateParams.displayMenu;
  }
}

export default MainController;
