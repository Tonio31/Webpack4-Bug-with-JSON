class ButtonModuleController {
  constructor($log, Utility, PdfGenerator) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ButtonModuleController' );

    $log.log('constructor - START');

    this.$onInit = () => {
      this.data = this.block.data;
    };

    this.getPositionClass = () => {
      return `button-${this.data.position}`;
    };

    this.goToButtonLink = (iType) => {

      if ( iType && iType.toUpperCase() === 'PDF' ) {
        $log.warn(`TONIO we want to print a PDF for ${this.data.href}`);

        PdfGenerator.generatePDF(this.data.href);
      }
      else {
        Utility.goToLink(this.data.href);
      }

    };

  }
}

export default ButtonModuleController;
