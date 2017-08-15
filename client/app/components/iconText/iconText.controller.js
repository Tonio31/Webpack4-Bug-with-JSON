class IconTextController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'IconTextController' );

    this.name = 'iconText';

    this.$onInit = () => {
      this.buttonData = {
        data: this.data.button
      };
      $log.log('$onInit() - this.buttonData=', this.buttonData);
    };

    this.isBorderPartOfIcon = (iIconType) => {
      switch (iIconType) {
        case 'icon-badge-lifemap':
        case 'icon-badge-self-discovery':
        case 'icon-badge-time-to-reflect':
        case 'icon-pl-logo':
          return true;
        default:
          return false;
      }
    };

    this.isIconWider = (iIconType) => {
      if ( iIconType === 'icon-badge-lifemap' ) {
        return true;
      }

      return false;
    };
  }
}

export default IconTextController;
