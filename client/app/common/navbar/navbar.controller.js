class NavbarController {
  constructor( $log, $state, STATES, Menu, JwtFactory, User) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance('NavbarController');

    $log.log('constructor() - BEGIN');

    this.homeState = STATES.HOME;

    this.$onInit = () => {
      $log.log('constructor()::$onInit - BEGIN');
      $log.log('constructor()::$onInit - END');
    };

    this.logout = () => {
      JwtFactory.logout();
      $state.go(STATES.LOGIN);
    };

    // check if the banner exists, returns true/false
    this.isBannerExist = () => {
       return Object.keys(User.getCompanyBanner()).length;
    };

    // This is a reference to the Menu stored in MenuFactory, When the menu is retrieved by app.js for
    // defining the states dynamically, we use it to display
    this.menu = Menu.getMenu();

    this.companyName = 'Potentialife';

    $log.log('constructor() - END');

  }
}

export default NavbarController;
