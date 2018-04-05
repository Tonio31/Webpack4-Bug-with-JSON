class NavbarController {
  constructor( $log,
               $anchorScroll,
               STATES,
               SPINNERS,
               Menu,
               SpinnerFactory,
               User ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance('NavbarController');

    this.homeState = STATES.HOME;

    this.$onInit = () => {
      this.courseContentSpinner = SpinnerFactory.getSpinner(SPINNERS.COURSE_CONTENT);
    };

    this.toggleMenu = () => {
      $anchorScroll();
    };

    // check if the banner exists, returns true/false
    this.isBannerExist = () => {
      return Object.keys(User.getCompanyBanner()).length;
    };

    this.getUserFullName = () => {
      return User.getFullName();
    };

    // This is a reference to the Menu stored in MenuFactory, When the menu is retrieved by app.js for
    // defining the states dynamically, we use it to display
    this.menu = Menu.getMenu();

    this.Potentialife = 'Potentialife';
  }
}

export default NavbarController;
