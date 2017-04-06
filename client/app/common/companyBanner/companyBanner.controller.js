class CompanyBannerController {
  constructor($log, User) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CompanyBannerController' );

    $log.log('constructor - START');

    this.data = User.getCompanyBanner();

    this.isBannerExist = () => {
      return Object.keys(this.data).length;
    };


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
