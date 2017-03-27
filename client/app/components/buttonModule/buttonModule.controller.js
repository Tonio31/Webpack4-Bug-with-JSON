class ButtonModuleController {
  constructor($log, Utility) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ButtonModuleController' );

    $log.log('constructor - START');

    this.$onInit = () => {
      this.data = this.block.data;
    };

    this.goToButtonLink = (iUrl) => {
      Utility.goToLink(iUrl);
    };

  }
}

export default ButtonModuleController;
