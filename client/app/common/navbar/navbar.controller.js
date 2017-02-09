class NavbarController {
  constructor( $log, _, Data, UserInfo, Menu) {
    "ngInject";
    $log.log("NavbarController::constructor() - BEGIN");

    this.$onInit = () => {
      $log.log("NavbarController::constructor()::$onInit - BEGIN");
      $log.log("NavbarController::constructor()::$onInit - END");
    };

    // This is a reference to the Menu stored in MenuService, When the menu is retrieved by app.js for
    // defining the states dynamically, we use it to display
    this.menu = Menu.getMenu();

    this.companyName = 'Potentialife';

    $log.log("NavbarController::constructor() - END");
  }
}

export default NavbarController;
