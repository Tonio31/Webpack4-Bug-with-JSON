class LoginRootController {
  constructor(SpinnerFactory, SPINNERS, WEBSITE_CONFIG) {
    'ngInject';

    this.topLevelSpinner = SpinnerFactory.getSpinner(SPINNERS.TOP_LEVEL);

    this.homePageBrochureWebsiteUrl = WEBSITE_CONFIG.brochureWebSite.homePageUrl;
  }
}

export default LoginRootController;
