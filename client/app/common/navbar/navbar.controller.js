class NavbarController {
  constructor( $log, _, Data, UserInfo, Menu) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance('NavbarController');

    $log.log('constructor() - BEGIN');

    this.$onInit = () => {
      $log.log('constructor()::$onInit - BEGIN');
      $log.log('constructor()::$onInit - END');
    };

    // This is a reference to the Menu stored in MenuFactory, When the menu is retrieved by app.js for
    // defining the states dynamically, we use it to display
    this.menu = Menu.getMenu();

    this.companyName = 'Potentialife';

    $log.log('constructor() - END');
  }
}

export default NavbarController;
