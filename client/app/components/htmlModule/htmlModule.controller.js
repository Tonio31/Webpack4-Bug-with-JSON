class HtmlModuleController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'HtmlModuleController' );

    $log.log('constructor - START');

    this.getBackGroundColour = () => {
      if ( this.data.hasOwnProperty('bgColor') ) {
        return `bgcolour-${this.data.bgColor}`;
      }

      return '';
    };
  }
}

export default HtmlModuleController;
