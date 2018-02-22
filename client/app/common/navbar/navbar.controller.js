class NavbarController {
  constructor( $log,
               $state,
               $anchorScroll,
               Data,
               STATES,
               SPINNERS,
               Menu,
               ErrorNotifierFactory,
               SpinnerFactory,
               ZendeskWidget,
               JwtFactory,
               User ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance('NavbarController');

    this.homeState = STATES.HOME;

    // This is a reference to "displayErrorPage" stored in ErrorNotifierFactory,
    // we use it to display or not the error page
    this.errorPage = ErrorNotifierFactory.isErrorPageDisplayed();
    // ErrorNotifierFactory.displayErrorPage();

    this.$onInit = () => {
      this.courseContentSpinner = SpinnerFactory.getSpinner(SPINNERS.COURSE_CONTENT);
    };

    this.logout = () => {
      // Unvalidate Token on server side
      Data.logout().$save();

      // Remove Token from local Storage
      JwtFactory.logout();

      // Hide Zendesk Widget
      ZendeskWidget.hide();

      // Go to login state
      $state.go(STATES.LOGIN);
    };

    this.toggleMenu = () => {
      $anchorScroll();
    };

    // check if the banner exists, returns true/false
    this.isBannerExist = () => {
      return Object.keys(User.getCompanyBanner()).length;
    };

    // This is a reference to the Menu stored in MenuFactory, When the menu is retrieved by app.js for
    // defining the states dynamically, we use it to display
    this.menu = Menu.getMenu();

    this.Potentialife = 'Potentialife';
  }
}

export default NavbarController;
