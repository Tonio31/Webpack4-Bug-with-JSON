class IconTextController {
  constructor($log, $state, $window) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'IconTextController' );

    this.name = 'iconText';

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


    this.goToButtonLink = (iUrl) => {
      let reExternalUrl = /^https?:\/\/.*$/;
      if ( iUrl.match(reExternalUrl) ) {
        $window.location.href = iUrl;
      }
      else {
        $state.go(iUrl);
      }
    };
  }
}

export default IconTextController;
