class UnorderedListController {
  constructor($log, $filter) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'UnorderedListController' );

    this.$onInit = () => {
      this.blockData = this.block.data;
      this.MIN_ELEMENTS_DISPLAYED = this.block.data.config.minItemsDisplayed;
      this.showMoreButtonDisplayed = this.block.data.config.showMoreButtonAtStart;


      if ( this.MIN_ELEMENTS_DISPLAYED !== 0 ) {
        this.showMoreLabel = $filter('translate')('SHOW_MORE').toString();
        this.hideLabel = $filter('translate')('SHOW_LESS').toString();
      }
      else {
        this.showMoreLabel = $filter('translate')('SHOW').toString();
        this.hideLabel = $filter('translate')('HIDE').toString();
      }

      this.limit = this.showMoreButtonDisplayed ? this.MIN_ELEMENTS_DISPLAYED : undefined;

      $log.info('this.blockData', this.blockData);
    };

    this.toggleMore = () => {
      this.showMoreButtonDisplayed = !this.showMoreButtonDisplayed;
      this.limit = this.showMoreButtonDisplayed ? this.MIN_ELEMENTS_DISPLAYED : undefined;
    };


  }
}

export default UnorderedListController;
