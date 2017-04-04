class UnorderedListController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'UnorderedListController' );

    this.MIN_ELEMENTS_DISPLAYED = 5;
    this.showMoreButtonDisplayed = true;
    this.limit = this.MIN_ELEMENTS_DISPLAYED;

    this.$onInit = () => {
      this.blockData = this.block.data;
      $log.info('this.blockData', this.blockData);
    };

    this.toggleMore = () => {

      this.showMoreButtonDisplayed = !this.showMoreButtonDisplayed;

      if ( this.showMoreButtonDisplayed ) {
        this.limit = this.MIN_ELEMENTS_DISPLAYED;
      }
      else {
        this.limit = undefined; // see limitTo docs: "If limit is undefined, the input will be returned unchanged."
      }
    };


  }
}

export default UnorderedListController;
