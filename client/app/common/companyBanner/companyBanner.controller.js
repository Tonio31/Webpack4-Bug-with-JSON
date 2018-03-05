class CompanyBannerController {
  constructor($log, User) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    // $log = $log.getInstance( 'CompanyBannerController' );

    this.data = User.getCompanyBanner();

    this.getCssStyle = () => {
      let style = {
        'background-color': this.data.bgColor,
        'color': this.data.textColor
      };
      return style;
    };
  }
}

export default CompanyBannerController;
