class IconTextController {
  constructor($log, $state, $window, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'IconTextController' );

    this.name = 'iconText';

    this.isBorderPartOfIcon = (iIconType) => {
      switch (iIconType) {
        case ICON_FONTELLO.SELF_DISCOVERY:
        case ICON_FONTELLO.TIME_REFLECT:
        case ICON_FONTELLO.LIFE_MAP:
          return true;
        default:
          return false;
      }
    };

    this.isIconBig = (iIconType) => {
      if ( iIconType === ICON_FONTELLO.LIFE_MAP) {
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
