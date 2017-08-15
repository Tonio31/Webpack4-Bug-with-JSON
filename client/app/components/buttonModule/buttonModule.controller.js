class ButtonModuleController {
  constructor($log, $window, $state, Utility, PdfGenerator) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ButtonModuleController' );

    $log.log('constructor - START');

    const BUTTON_TYPE = {
      PDF: 'pdf',
      EXTERNAL_LINK: 'link',
      STATE: 'state'
    };


    this.$onInit = () => {
      this.data = this.block.data;
    };

    this.getPositionClass = () => {
      let positionClass = '';
      if ( this.data.position ) {
        positionClass = `button-${this.data.position}`;
      }
      return positionClass;
    };

    this.goToButtonLink = (iType) => {

      if ( iType ) {
        if ( iType === BUTTON_TYPE.PDF ) {
          PdfGenerator.generatePDF(this.data.href);
        }
        else if ( iType === BUTTON_TYPE.EXTERNAL_LINK ) {
          $log.log('About to redirect to different URL: ', this.data.href);
          $window.open( this.data.href, '_blank' );
        }
        else if ( iType === BUTTON_TYPE.STATE ) {
          $log.log('About to change state to go to: ', this.data.href);
          $state.go(this.data.href);
        }
        else {
          $log.error('Button Type unknown: ', iType, ' - Clicking the button will do nothing');
        }
      }
      else {
        // Legacy, we use to "calculate" what the button will do based on the string in href,
        // but for clarity we introduced a type of button in the CMS, this part is in case the
        // type is undefined
        Utility.goToLink(this.data.href);
      }

    };

  }
}

export default ButtonModuleController;
